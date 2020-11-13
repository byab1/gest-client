<?php

namespace App\Event;

use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Client;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Security;

class ClientsUserSubscriber implements EventSubscriberInterface
{
    private $security;
    public function __construct(Security $security)
    {
        $this->security = $security;
    }
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setUserForClient', EventPriorities::PRE_VALIDATE]
        ];
    }
    public function setUserForClient(ViewEvent $event)
    {
        $client = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($client instanceof Client && $method === "POST") {
            //Choper l'user actuellement connecté

            $user = $this->security->getUser();

            //Assigner l'utilisateur connecté au client qu'on est en train de créer
            $client->setUser($user);
        }
    }
}
