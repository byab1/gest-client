<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\ClientRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use Doctrine\Common\Collections\Collection;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=ClientRepository::class)
 * @ApiResource(
 * collectionOperations={"get", "post"},
 * itemOperations={"get", "put", "delete"},
 * normalizationContext={
 * "groups"={"clients_lecture"}
 * }
 * )
 * @ApiFilter(SearchFilter::class)
 * @ApiFilter(OrderFilter::class)
 */
class Client
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"clients_lecture", "factures_lecture"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_lecture", "factures_lecture"})
     * @Assert\NotBlank(message="Le prenom du client est obligatoire")
     * @Assert\Length(min=3, minMessage="Le prénom doit avoir au moins 3 caractères")
     */
    private $prenom;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_lecture", "factures_lecture"})
     * @Assert\NotBlank(message="Le nom du client est obligatoire")
     * @Assert\Length(min=3, minMessage="Le nom doit avoir au moins 3 caractères")
     */
    private $nom;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"clients_lecture", "factures_lecture"})
     * @Assert\NotBlank(message="L'adresse email est obligatoire")
     * @Assert\Email(message="Le format de l'adresse email doit etre valide ")
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"clients_lecture", "factures_lecture"})
     */
    private $entreprise;

    /**
     * @ORM\OneToMany(targetEntity=Facture::class, mappedBy="client")
     * @Groups({"clients_lecture"})
     * @ApiSubresource
     */
    private $factures;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="clients")
     * @Groups({"clients_lecture"})
     * @Assert\NotBlank(message="L'utilisateur est obligatoire")
     */
    private $user;



    public function __construct()
    {
        $this->factures = new ArrayCollection();
    }

    /**
     * Permet de calculer automatiquement le montant total de la facture
     * @Groups({"clients_lecture"})
     *
     * @return float
     */
    public function getTotalMontant(): float
    {
        return array_reduce($this->factures->toArray(), function ($total, $facture) {
            return $total + $facture->getMontant();
        }, 0);
    }

    /**
     * Permet de calculer le montant total des factures non payées
     * @Groups({"clients_lecture"})
     */
    public function getFactureNonPayee(): float
    {
        return array_reduce($this->factures->toArray(), function ($total, $facture) {
            return $total + ($facture->getStatus() === "PAID" || $facture->getStatus() === "CANCELED" ? 0 :
                $facture->getMontant());
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): self
    {
        $this->prenom = $prenom;

        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): self
    {
        $this->nom = $nom;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getEntreprise(): ?string
    {
        return $this->entreprise;
    }

    public function setEntreprise(?string $entreprise): self
    {
        $this->entreprise = $entreprise;

        return $this;
    }

    /**
     * @return Collection|Facture[]
     */
    public function getFactures(): Collection
    {
        return $this->factures;
    }

    public function addFacture(Facture $facture): self
    {
        if (!$this->factures->contains($facture)) {
            $this->factures[] = $facture;
            $facture->setClient($this);
        }

        return $this;
    }

    public function removeFacture(Facture $facture): self
    {
        if ($this->factures->removeElement($facture)) {
            // set the owning side to null (unless already changed)
            if ($facture->getClient() === $this) {
                $facture->setClient(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
