<?php

namespace App\Event;

use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Facture;
use App\Repository\FactureRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class FactureChronoSubscriber implements EventSubscriberInterface
{
    private $security;
    private $repository;
    public function __construct(Security $security, FactureRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForFacture', EventPriorities::PRE_VALIDATE]
        ];
    }
    public function setChronoForFacture(ViewEvent $event)
    {
        $facture = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($facture instanceof Facture && $method === "POST") {
            $nextChrono = $this->repository->getNextChrono($this->security->getUser());
            $facture->setChrono($nextChrono);

            //A déplacer dans une classe appropriée

            if (empty($facture->getEnvoyeLe())) {
                $facture->setEnvoyeLe(new \DateTime());
            }
        }
    }
}
