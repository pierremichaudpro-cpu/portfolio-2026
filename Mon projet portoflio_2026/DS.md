## Design System – Portfolio Pierre Michaud

Ce document décrit les **tokens**, **composants UI** et quelques règles de base pour garder le projet cohérent entre Figma et le code.

---

## 1. Design Tokens

### 1.1. Layout

- **`--page-margin`** : marge horizontale principale de la page.
- **`--max-content-width`** : largeur max du contenu.
- **`--hero-height`** : hauteur minimum du hero.

### 1.2. Typographie

- **`--font-main`** : police principale (corps, UI).
- **`--font-display`** : police des titres display.

Les classes typographiques (ex. `display-large`, `title-medium`, `body-medium`, etc.) doivent rester alignées avec les styles de texte définis dans Figma (noms et hiérarchie).

### 1.3. Spacing (échelle)

- **`--space-xs`** : 4px  
- **`--space-s`** : 8px  
- **`--space-m`** : 16px  
- **`--space-l`** : 24px  
- **`--space-xl`** : 32px  

Utiliser ces espacements pour les marges/paddings récurrents (sections, cartes, boutons, chips…).

### 1.4. Radius (échelle)

- **`--radius-s`** : 8px  
- **`--radius-m`** : 12px  
- **`--radius-l`** : 16px  
- **`--radius-xl`** : 24px  
- **`--radius-pill`** : 999px (pour les formes pilules)

Tous les composants “pill” (chips, tags, certains boutons) doivent utiliser `--radius-pill`.

### 1.5. Couleurs sémantiques

- **`--bg-color`** : fond principal (page).
- **`--surface-color`** : surface de base (cartes, sections).
- **`--surface-elevated-color`** : surfaces surélevées (chat, boutons flottants, etc.).
- **`--border-color`** : bordures subtiles.
- **`--border-strong-color`** : bordures plus marquées.
- **`--text-primary`** : texte principal.
- **`--text-secondary`** : texte secondaire.
- **`--text-muted`** : texte atténué (footer, éléments secondaires).

Ces couleurs remplacent progressivement les valeurs hexadécimales directes (`#111`, `#333`, `#444`…) pour faciliter les changements de thème.

### 1.6. Ombres

- **`--shadow-soft`** : ombre douce utilisée pour les éléments flottants (CTA, modales, chat).

---

## 2. Composants UI

Les composants suivants existent à la fois en design (Figma) et dans le code. Les noms doivent rester alignés autant que possible.

### 2.1. Card – `project-card`

- **Classe principale** : `project-card`
- Utilisation :
  - Fond : `var(--surface-color)`
  - Bordure : `var(--border-color)`
  - Rayons : 24px (proche de `--radius-xl`)
- Contenu :
  - Titre (`h3`)
  - Tag(s) (`.tag`)
  - Description
  - Call-to-action texte : `.btn-project`

**Bon réflexe designer** : en cas de changement de style des cartes (rayons, bordures, ombre), le faire dans le bloc `.project-card` uniquement.

### 2.2. Tag – `tag`

- **Classe** : `tag`
- Style “chip” intégré dans les cartes de projet.
- Utilise un fond dégradé et une bordure transparente avec `background-clip`.

À garder pour les métadonnées (type de projet, plateforme, rôle).

### 2.3. Chips – `chip`, `skill-chip`, `tool-chip`

- **Base** : `.chip`
  - Typo : `var(--font-main)`
  - Rayons : `--radius-pill`
  - Bordure : `0.5px solid transparent`
  - Animation d’apparition : `fadeUp`
- **Variantes** :
  - `.skill-chip` : dégradé bleu/cyan.
  - `.tool-chip` : dégradé violet/rose.

Ces chips correspondent aux “Compétences & Outils”.  
Si de nouvelles familles de chips apparaissent dans Figma, créer simplement une nouvelle variante `.chip--xxx` ou un bloc dédié similaire à `skill-chip` / `tool-chip`.

### 2.4. Boutons

#### 2.4.1. Bouton de projet – `btn-project`

- Style bouton pilule, utilisé dans les cartes (“Voir le projet”).
- Couleurs :
  - Texte : `var(--text-primary)`
  - Bordure : `#444` (à terme : token dédié).
  - Hover : fond blanc, texte noir.

#### 2.4.2. Bouton de fermeture modale – `close-btn`

- Classe : `close-btn`
- Fond : `var(--surface-elevated-color)`
- Texte : `var(--text-primary)`
- Bordure : `var(--border-strong-color)`
- Rayons : `var(--radius-pill)`
- Hover : fond blanc, texte noir.

#### 2.4.3. CTA flottant – `floating-cta`

- Élément fixé en bas à droite (ou centré sur mobile).
- Bordure dégradée animée + fond blanc.
- Utilise `var(--shadow-soft)` pour l’ombre.

En design, ce composant doit être décliné comme un pattern fort (contact / prise de rendez-vous).

### 2.5. Modale projet – `modal-overlay` / `modal-content`

- Overlay pleine page : `modal-overlay`
- Contenu projet (injeté via JS) : `modal-content` / section associée.
- Fond overlay : noir avec flou (`backdrop-filter: blur(10px)`).
- Scroll vertical interne sur le contenu.

Équivalent direct du composant “Full screen modal” côté Figma.

### 2.6. Interface de chat – `chat-interface`

- Wrapper : `chat-modal-wrapper`
- Contenu principal : `chat-interface`
  - Fond : `var(--surface-elevated-color)`
  - Bordure : `var(--border-strong-color)`
  - Ombre : `var(--shadow-soft)`
- Header, body, input et bouton d’envoi structurés en sous-composants.

Ce composant peut servir de base à tout pattern de “conversation” ou “support”.

### 2.7. Footer – `footer`

- Bordure supérieure : `var(--border-color)`
- Texte : `var(--text-muted)`

Pour toute information secondaire / légale.

---

## 3. Règles de contribution (designer & code)

1. **Toujours utiliser un token** plutôt qu’une valeur brute (`#111`, `16px`, etc.) dès que c’est un pattern récurrent.
2. **Aligner les noms des composants** avec Figma :
   - Figma : `Chip / Skill` → CSS : `.chip.skill-chip`
   - Figma : `Button / Primary` → CSS : `.btn.btn--primary` (ou équivalent existant).
3. **Documenter toute nouvelle famille de composants** ici :
   - Description courte
   - Rôle (quand l’utiliser)
   - Tokens clés utilisés (couleurs, rayons, etc.).
4. **Éviter la duplication de styles** :
   - Si un pattern ressemble beaucoup à un composant existant, partir de ce composant et créer une variante plutôt qu’un nouveau style isolé.

---

## 4. Pistes d’évolution

- Extraire les styles en plusieurs fichiers (`tokens`, `components`, `layout`) si le projet grossit.
- Mapper les composants Figma en Dev Mode avec leurs équivalents CSS/HTML via Figma Code Connect.
- Introduire progressivement un framework orienté composants (React, Vue, etc.) en réutilisant ces tokens et ces conventions de nommage.
