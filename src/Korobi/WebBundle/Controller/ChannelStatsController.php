<?php

namespace Korobi\WebBundle\Controller;

use Korobi\WebBundle\Document\Channel;
use Korobi\WebBundle\Document\Network;
use Korobi\WebBundle\Parser\IRCTextParser;
use Symfony\Component\HttpFoundation\Request;

class ChannelStatsController extends BaseController {

    /**
     * @param Request $request
     * @param $network
     * @param $channel
     * @return \Symfony\Component\HttpFoundation\Response
     * @throws \Exception
     */
    public function statsAction(Request $request, $network, $channel) {
        // validate network
        /** @var $dbNetwork Network */
        $dbNetwork = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('KorobiWebBundle:Network')
            ->findNetwork($network)
            ->toArray(false);

        // make sure we actually have a network
        if (empty($dbNetwork)) {
            throw $this->createNotFoundException('Could not find network');
        }

        // grab first slice
        $dbNetwork = $dbNetwork[0];

        // fetch channel
        /** @var $dbChannel Channel */
        $dbChannel = $this->get('doctrine_mongodb')
            ->getManager()
            ->getRepository('KorobiWebBundle:Channel')
            ->findByChannel($network, self::transformChannelName($channel, true)) // TODO
            ->toArray(false);

        // make sure we actually have a channel
        if (empty($dbChannel)) {
            throw $this->createNotFoundException('Could not find channel');
        }

        // grab first slice
        $dbChannel = $dbChannel[0];

        // check if this channel requires a key
        if ($dbChannel->getKey() !== null) {
            $key = $request->query->get('key');
            if ($key === null || $key !== $dbChannel->getKey()) {
                throw new \Exception('Unauthorized'); // TODO
            }
        }

        // TODO
        $stats_file = file_get_contents($this->container->getParameter('channel_stats_root') . $dbNetwork->getSlug() . '/' . self::transformChannelName($dbChannel->getChannel()) . '.html');
        $stats_output = '';
        foreach (explode('\n', $stats_file) as $line) {
            $stats_output .= IRCTextParser::parseLine($line, true);
        }

        return $this->render('KorobiWebBundle:controller/channel:stats.html.twig', [
            'network_name' => $dbNetwork->getName(),
            'channel_name' => $dbChannel->getChannel(),
            'data' => $stats_output,
        ]);
    }
}