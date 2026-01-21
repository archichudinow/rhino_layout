DEBUG & VIEW MODES (REQUIRED)

Implement toggles for:

Geometry only

Facade exposure

Access graph

Overlap detection

Circulation paths

AI INTEGRATION RULES

AI may:

Propose room proportions

Suggest group typologies

Score variants

Generate notes

AI must NOT:

Finalize selections

Place geometry directly

TECH STACK ASSUMPTIONS

Three.js or react-three-fiber

React UI

Global state management

Disposable geometry generation

SUCCESS CRITERIA

The system is successful if:

A user can inspect every generated variant

A user can select and lock decisions

The system produces predictable, debuggable layouts

The logic scales without collapsing into randomness

DEVELOPMENT ORDER (IMPORTANT)

RoomNode + RoomVariant generation

Room preview + UI selection

GroupNode logic

Group preview + UI selection

Building assembly

Debug modes

AI augmentation