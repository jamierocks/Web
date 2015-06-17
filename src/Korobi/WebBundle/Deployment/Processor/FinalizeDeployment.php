<?php

namespace Korobi\WebBundle\Deployment\Processor;

use Korobi\WebBundle\Deployment\DeploymentInfo;
use Korobi\WebBundle\Deployment\DeploymentStatus;

/**
 * Saves deployment results to the database.
 *
 * @package Korobi\WebBundle\Deployment\Processor
 */
class FinalizeDeployment extends BaseProcessor implements DeploymentProcessorInterface {

    public function handle(DeploymentInfo $info) {
        $this->dm->persist($info->getRevision());
        $this->dm->flush();
        $this->akio->message()->text('Full details at https://dev.korobi.io/deploy/view/' . $info->getRevision()->getId())->send('deploy');

        return DeploymentStatus::OK;
    }
}
