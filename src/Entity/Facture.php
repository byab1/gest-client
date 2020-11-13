<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\FactureRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass=FactureRepository::class)
 * @ApiResource(
 * subresourceOperations={
 * "api_clients_factures_get_subresource"={
 * "normalization_context"={"groups"={"factures_subresource"}}
 * }
 * },
 * attributes={
 *  "pagination_enabled"=true,
 *  "pagination_items_per_page": 20,
 * "order": {"montant": "desc"}
 * },
 * normalizationContext={"groups"={"factures_lecture"}},
 * denormalizationContext={"disable_type_enforcement"= true}
 * )
 * @ApiFilter(OrderFilter::class, properties={"montant", "envoyeLe"})
 */
class Facture
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"factures_lecture", "clients_lecture", "factures_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"factures_lecture", "clients_lecture", "factures_subresource"})
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit est un numérique")
     */
    private $montant;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"factures_lecture", "clients_lecture", "factures_subresource"})
     * @Assert\DateTime(message="La date doit etre au format YYYY-MM-DD")
     * @Assert\NotBlank(message="La date d'envoie doit etre renseignée !")
     */
    private $envoyeLe;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"factures_lecture", "clients_lecture", "factures_subresource"})
     * @Assert\NotBlank(message="Le status de la facture est obligatoire")
     * @Assert\Choice(choices={"SENT", "PAID", "CANCELLED"}, message="Le status de la facture doit etre SENT, PAIS ou CANCELLED")
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Client::class, inversedBy="factures")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"factures_lecture"})
     * @Assert\NotBlank(message="Le client de la facture est obligatoire")
     */
    private $client;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"factures_lecture", "clients_lecture", "factures_subresource"})
     * @Assert\NotBlank(message="Le chrono de la facture est obligatoire")
     */
    private $chrono;

    /**
     * Permet de recuperer l'user a qui appartient la facture
     * @Groups({"factures_lecture", "factures_subresource"})
     * @return User
     */

    public function getUser(): User
    {
        return $this->client->getUser();
    }
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getMontant(): ?float
    {
        return $this->montant;
    }

    public function setMontant($montant): self
    {
        $this->montant = $montant;

        return $this;
    }

    public function getEnvoyeLe(): ?\DateTimeInterface
    {
        return $this->envoyeLe;
    }

    public function setEnvoyeLe(\DateTime $envoyeLe): self
    {
        $this->envoyeLe = $envoyeLe;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): self
    {
        $this->client = $client;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
