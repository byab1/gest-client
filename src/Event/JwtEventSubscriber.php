<?php

namespace App\Event;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtEventSubscriber
{
    public function updateJwtData(JWTCreatedEvent $event)
    {
        //Recuperer l'user pour avoir son nom et prenom
        $user = $event->getUser();
        //Enrichire les data pour qu'elle contienne ces données
        $data = $event->getData();
        $data['firstName'] = $user->getNom();
        $data['lastName'] = $user->getPrenom();

        $event->setData($data);
    }
}
