<?php

namespace Korobi\WebBundle\Util;

/**
 * Handle getting info about git branches, commits, etc.
 *
 * @package Korobi\WebBundle\Util
 */
class GitInfo {

    const ONLINE_ENVS = ['staging', 'prod'];

    protected $branch;
    protected $hash;
    protected $tempRef;

    /**
     * @param string $environment Current environment's name.
     * @param string $appDir Absolute path to app directory.
     */
    public function __construct($environment, $appDir) {
        $this->updateData(dirname($appDir));
    }

    /**
     * Force update data.
     *
     * @param string $rootDir Absolute path to root directory.
     */
    public function updateData($rootDir) {
        // This process is not simple! Please be careful when maintaining this code.
        // Please refer to the flowchart in the PR for further information on how this works.

        $process = [
            "checkIsGitRepo",
            "checkForGitHeadFile",
            "checkForPackedRefs",
            "useFallbackCommand"
        ];
        $gitDir = $rootDir . DIRECTORY_SEPARATOR . ".git" . DIRECTORY_SEPARATOR;
        $firstItem = array_shift($process);
        /** @var $firstItem Callable */
        $this->$firstItem($gitDir, $process);
    }

    /*
     * Begin chain-of-responsibility function definitions
     * --------------------------------------------------
     */

    private function checkIsGitRepo($gitDir, $stack) {
        if (file_exists($gitDir)) {
            /** @var Callable $next */
            $next = array_shift($stack);
            $this->$next($gitDir, $stack);
        } else {
            $this->setBranchAndHash("unknown", "unknown");
        }
    }

    private function checkForGitHeadFile($gitDir, $stack) {
        if (file_exists($gitDir . "HEAD")) {
            $headContents = fgets(fopen($gitDir . "HEAD", 'r')); // resource acquisition is initialization
            $this->handleGitHeadFile($gitDir, $headContents, $stack);
        } else {
            $this->setBranchAndHash("unknown", "unknown");
        }
    }

    private function handleGitHeadFile($gitDir, $headContents, $stack) {
        if (strpos($headContents, "ref: ") === -1) {
            $this->setBranchAndHash($headContents, $headContents);
        } else {
            $referencedFile = trim(substr($headContents, 5));
            $this->branch = str_replace("/refs/heads/", "", $referencedFile);
            $this->tempRef = $referencedFile;
            if (!file_exists($gitDir . $referencedFile)) {
                /** @var Callable $next */
                $next = array_shift($stack);
                $this->$next($gitDir, $stack);
            } else {
                $this->hash = file_get_contents($gitDir . $referencedFile);
            }
        }
    }

    private function checkForPackedRefs($gitDir, $stack) {
        $refToLocate = $this->tempRef;
        if (file_exists($gitDir . "packed-refs")) {
            $packedRefData = file_get_contents($gitDir . "packed-refs");
            $loc = strpos($packedRefData, $refToLocate);
            $commitHash = "";
            if ($loc !== false) {
                while ($packedRefData[$loc] !== "\n" && $loc > 0) {
                    $loc--;
                    $commitHash .= $packedRefData[$loc];
                }
                $this->hash = strrev($commitHash);
                return;
            }
        }
        /** @var Callable $next */
        $next = array_shift($stack);
        $this->$next($gitDir, $stack);
    }

    private function useFallbackCommand($gitDir, $stack) {
        $this->branch = trim(`git rev-parse --abbrev-ref HEAD 2>&1`);
        $this->hash = trim(`git rev-parse HEAD 2>&1`);
    }

    /*
     * --------------------------------------------------
     * End chain-of-responsibility function definitions
     */

    /**
     * @return string The name of the current git branch.
     */
    public function getBranch() {
        return $this->branch;
    }

    /**
     * @return string The current hash.
     */
    public function getHash() {
        return $this->hash;
    }

    /**
     * @param int $length Length of short hash
     * @return string The shorter hash
     */
    public function getShortHash($length = 7) {
        return substr($this->hash, 0, $length);
    }

    private function setBranchAndHash($branch, $hash) {
        $this->branch = $branch;
        $this->hash = $hash;
    }
}
