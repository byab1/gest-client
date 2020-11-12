<?php

namespace App\DataFixtures;

use App\Entity\Client;
use App\Entity\Facture;
use App\Entity\User;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * L'encoder de mot de passe
     *
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }
    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');

        //Création des utilisateurs

        for ($c = 1; $c < 10; $c++) {
            $user = new User();
            $chrono = 1;
            $hash = $this->encoder->encodePassword($user, "password");
            $user->setNom($faker->firstName())
                ->setPrenom($faker->lastName())
                ->setEmail($faker->email())
                ->setPassword($hash);

            $manager->persist($user);

            //Créer des clients

            for ($i = 1; $i < mt_rand(5, 20); $i++) {
                $client = new Client();

                $client->setNom($faker->firstname())
                    ->setPrenom($faker->lastName())
                    ->setEntreprise($faker->company())
                    ->setEmail($faker->email());

                $manager->persist($client);

                //Créer des factures pour des clients

                for ($j = 0; $j < mt_rand(3, 7); $j++) {
                    $facture = new Facture();

                    $facture->setMontant($faker->randomFloat(2, 250, 5000))
                        ->setEnvoyeLe($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELED']))
                        ->setClient($client)
                        ->setChrono($chrono);

                    $chrono++;

                    $manager->persist($facture);
                }
            }
        }


        $manager->flush();
    }
}
