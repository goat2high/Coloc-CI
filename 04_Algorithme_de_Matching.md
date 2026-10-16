# Algorithme de Matching
## Plateforme de Colocation – Côte d’Ivoire

### 1. Principe général
L’algorithme calcule un **score de compatibilité** (de 0 à 100 %) entre :
- Le profil de la personne qui cherche une colocation
- Chaque annonce (et le profil du propriétaire / colocataire existant)

Le score final est une **moyenne pondérée** des différents critères.

---

### 2. Critères et pondération recommandée

| Critère              | Poids | Type de comparaison                  |
|----------------------|-------|--------------------------------------|
| Budget               | 25 %  | Correspondance numérique             |
| Quartier / Ville     | 20 %  | Exact ou proche                      |
| Mode de vie          | 15 %  | Calme / social / mixte               |
| Fumeur               | 10 %  | Exact match                          |
| Animaux              | 10 %  | Exact match                          |
| Type de chambre      | 8 %   | Privée / partagée                    |
| Salle de bain        | 5 %   | Privée / partagée                    |
| Sexe préféré         | 4 %   | Exact (si renseigné)                 |
| Propreté / Organisation | 3 % | Score de 1 à 5                     |

---

### 3. Fonctions de calcul (Python)

```python
def score_budget(budget_chercheur, loyer_annonce, charges=0):
    total = loyer_annonce + charges
    if total <= budget_chercheur:
        return 100
    difference = total - budget_chercheur
    if difference <= 20000:      # 20 000 FCFA de marge
        return 80
    elif difference <= 40000:
        return 50
    else:
        return 0


def score_quartier(quartier_chercheur, quartier_annonce, ville_chercheur, ville_annonce):
    if ville_chercheur != ville_annonce:
        return 0
    if quartier_chercheur == quartier_annonce:
        return 100

    # Exemple de quartiers proches (à enrichir)
    quartiers_proches = {
        "Cocody": ["Riviera", "Angré", "2 Plateaux"],
        "Riviera": ["Cocody", "Angré"],
        "Yopougon": ["Songon"],
        # Ajouter d'autres correspondances
    }
    if quartier_annonce in quartiers_proches.get(quartier_chercheur, []):
        return 70
    return 30  # même ville mais quartier différent


def score_exact(valeur1, valeur2):
    """Pour fumeur, animaux, sexe, type de chambre, etc."""
    if valeur1 is None or valeur2 is None:
        return 70  # neutre si non renseigné
    return 100 if valeur1 == valeur2 else 0


def score_mode_vie(mode1, mode2):
    if mode1 == mode2:
        return 100
    compat = {
        ("calme", "mixte"): 70,
        ("social", "mixte"): 70,
        ("calme", "social"): 20,
    }
    return compat.get((mode1, mode2), 20) or compat.get((mode2, mode1), 20)
```

---

### 4. Fonction principale

```python
def calculer_compatibilite(chercheur: dict, annonce: dict) -> int:
    """
    Calcule le score de compatibilité entre un chercheur et une annonce.
    Retourne un entier entre 0 et 100.
    """
    scores = {
        'budget': score_budget(
            chercheur['budget_max'],
            annonce['loyer'],
            annonce.get('charges', 0)
        ),
        'quartier': score_quartier(
            chercheur.get('quartier'),
            annonce.get('quartier'),
            chercheur.get('ville'),
            annonce.get('ville')
        ),
        'mode_vie': score_mode_vie(
            chercheur.get('mode_vie'),
            annonce.get('mode_vie')
        ),
        'fumeur': score_exact(
            chercheur.get('fumeur'),
            annonce.get('fumeur')
        ),
        'animaux': score_exact(
            chercheur.get('animaux'),
            annonce.get('animaux')
        ),
        'type_chambre': score_exact(
            chercheur.get('type_chambre'),
            annonce.get('type_chambre')
        ),
    }

    poids = {
        'budget': 0.25,
        'quartier': 0.20,
        'mode_vie': 0.15,
        'fumeur': 0.10,
        'animaux': 0.10,
        'type_chambre': 0.08,
    }

    score_final = sum(scores.get(critere, 50) * poids_critere for critere, poids_critere in poids.items())
    return round(score_final)
```

---

### 5. Utilisation dans Flask (exemple)

```python
@app.route('/rechercher')
@login_required
def rechercher():
    chercheur = get_profil_utilisateur(current_user.id)
    annonces = Annonce.query.filter_by(statut='active').all()

    resultats = []
    for annonce in annonces:
        score = calculer_compatibilite(chercheur, annonce.to_dict())
        resultats.append({
            'annonce': annonce,
            'score': score
        })

    # Tri par score décroissant
    resultats.sort(key=lambda x: x['score'], reverse=True)

    return render_template('resultats.html', resultats=resultats)
```

---

### 6. Affichage recommandé (Frontend)

- **≥ 80 %** → Vert (bonne compatibilité)
- **60 – 79 %** → Orange (compatibilité moyenne)
- **< 60 %** → Rouge (faible compatibilité)

Afficher également le détail par critère pour plus de transparence.
