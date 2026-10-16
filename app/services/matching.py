"""
Service de matching ColocCI
===========================
Calcule le score de compatibilité (0-100) entre le profil d'un chercheur
et une annonce, selon l'algorithme défini dans 04_Algorithme_de_Matching.md.
"""

# ── Quartiers proches à Abidjan ──────────────────────────────────────────────
QUARTIERS_PROCHES: dict[str, list[str]] = {
    "Cocody":      ["Riviera", "Angré", "2 Plateaux", "Bingerville"],
    "Riviera":     ["Cocody", "Angré", "Bingerville"],
    "Angré":       ["Cocody", "Riviera", "2 Plateaux"],
    "2 Plateaux":  ["Cocody", "Angré"],
    "Yopougon":    ["Songon", "Attécoubé"],
    "Songon":      ["Yopougon"],
    "Attécoubé":   ["Yopougon", "Adjamé"],
    "Adjamé":      ["Attécoubé", "Plateau", "Abobo"],
    "Abobo":       ["Adjamé", "Anyama"],
    "Plateau":     ["Adjamé", "Treichville", "Marcory"],
    "Treichville": ["Plateau", "Marcory", "Port-Bouët"],
    "Marcory":     ["Treichville", "Koumassi", "Plateau"],
    "Koumassi":    ["Marcory", "Port-Bouët"],
    "Port-Bouët":  ["Koumassi", "Treichville"],
}


# ── Fonctions élémentaires ────────────────────────────────────────────────────

def score_budget(budget_chercheur: int, loyer_annonce: int, charges: int = 0) -> int:
    """Pondération 25% — compare le budget max du chercheur au loyer total."""
    total = loyer_annonce + charges
    if total <= budget_chercheur:
        return 100
    diff = total - budget_chercheur
    if diff <= 20_000:
        return 80
    if diff <= 40_000:
        return 50
    return 0


def score_quartier(
    quartier_chercheur: str | None,
    quartier_annonce: str | None,
    ville_chercheur: str | None,
    ville_annonce: str | None,
) -> int:
    """Pondération 20% — même ville requis, bonus si quartiers proches."""
    if not ville_chercheur or not ville_annonce:
        return 50   # neutre si non renseigné
    if ville_chercheur.strip().lower() != ville_annonce.strip().lower():
        return 0
    if not quartier_chercheur or not quartier_annonce:
        return 50
    if quartier_chercheur.strip().lower() == quartier_annonce.strip().lower():
        return 100
    voisins = [q.lower() for q in QUARTIERS_PROCHES.get(quartier_chercheur, [])]
    if quartier_annonce.strip().lower() in voisins:
        return 70
    return 30   # même ville, quartier différent


def score_exact(valeur1, valeur2) -> int:
    """Pondération variable — match exact (fumeur, animaux, type_chambre, etc.)."""
    if valeur1 is None or valeur2 is None:
        return 70   # neutre si non renseigné
    return 100 if valeur1 == valeur2 else 0


def score_mode_vie(mode1: str | None, mode2: str | None) -> int:
    """Pondération 15% — compatibilité des modes de vie."""
    if not mode1 or not mode2:
        return 70
    if mode1 == mode2:
        return 100
    compat = {
        ("Calme",  "Mixte"):  70,
        ("Social", "Mixte"):  70,
        ("Calme",  "Social"): 20,
    }
    return compat.get((mode1, mode2)) or compat.get((mode2, mode1)) or 20


# ── Fonction principale ───────────────────────────────────────────────────────

POIDS = {
    'budget':      0.25,
    'quartier':    0.20,
    'mode_vie':    0.15,
    'fumeur':      0.10,
    'animaux':     0.10,
    'type_chambre': 0.08,
    # Les 12% restants (salle_de_bain 5%, sexe 4%, propreté 3%)
    # sont ignorés si non renseignés — le score est ramené à 100%.
}


def calculer_compatibilite(chercheur: dict, annonce: dict) -> tuple[int, dict]:
    """
    Calcule le score de compatibilité entre un chercheur et une annonce.

    Args:
        chercheur: dict avec les clés du profil chercheur
        annonce:   dict avec les clés de l'annonce

    Returns:
        (score_final: int 0-100, details: dict par critère)
    """
    raw_scores = {
        'budget': score_budget(
            chercheur.get('budget_max', 0),
            annonce.get('loyer', 0),
            annonce.get('charges', 0),
        ),
        'quartier': score_quartier(
            chercheur.get('quartier'),
            annonce.get('quartier'),
            chercheur.get('ville'),
            annonce.get('ville'),
        ),
        'mode_vie': score_mode_vie(
            chercheur.get('mode_vie'),
            annonce.get('mode_vie'),
        ),
        'fumeur': score_exact(
            chercheur.get('fumeur'),
            annonce.get('fumeur'),
        ),
        'animaux': score_exact(
            chercheur.get('animaux'),
            annonce.get('animaux'),
        ),
        'type_chambre': score_exact(
            chercheur.get('type_chambre'),
            annonce.get('type_chambre'),
        ),
    }

    score_final = sum(
        raw_scores[critere] * poids
        for critere, poids in POIDS.items()
    )

    return round(score_final), raw_scores


def label_compatibilite(score: int) -> str:
    """Retourne le label de compatibilité selon le score."""
    if score >= 80:
        return 'Excellente'
    if score >= 60:
        return 'Bonne'
    return 'Faible'
