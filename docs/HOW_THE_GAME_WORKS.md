# How the game works

The game exists to make you **study**: quantum mechanics, solid state physics and astrophysics, in the style of your real exams.
Everything you do is saved in your profile (a file on the server), so it is the same on the phone and on a PC.

## The idea in one minute

1. A **room** is one topic of a course (for example "The Tunneling Bridge"). You walk (or fly) there in 3D, or pick it from a list.
2. In a room, **consoles** hold exercises of different kinds. You do them, you earn **XP**.
3. What you get wrong **comes back** after a while: a **respawn**. That is how it sticks in your memory, so it is not a punishment.
4. Every day there are small **missions**, a **streak** and a **daily goal**, so studying becomes a habit.
5. Before the exam you train in the **Exam hall** with timed mock exams and Swiss grades.

## The world

- **The Nexus** is the map of everything: every galaxy is a course, every star is a room. A ring around a star shows your progress (gold = cleared),
  a red pulse means something is due there, a light beam marks the room recommended next. Curved beams connect topics *across* courses
  (for example tunnelling and the Sun fusing hydrogen). Fly up to a star to read what is in it. N brings you back.
- **Connections** show how topics of different courses explain each other: the equations that correspond, the situation where it applies, what it means for experiments and for intuition (46 of them).
  In a room: the **Connections** button (key K) lists that room's. In the Nexus: the same button opens **all connections**; facing a star, its card lists that star's connections (tap one for the full explanation, or "Open all in detail").
  On a phone the button is in the top bar and in the Menu.
- **Guide mode** (button "Guide: on") shows one next step at a time: the gold beam in the Nexus, the pulsing console in a room.
- **Rooms** are in a recommended order (the guided route), but nothing stops you from skipping around.

## The consoles of a room

| Console | What it is |
|---|---|
| **Library** | Lessons: theory and intuition with check questions. Read first. |
| **Experiments** | Interactive simulations ("what if?"): move a slider, remove a term, see what happens. |
| **Quiz hall** | Exam-style multiple choice, one attempt per question, with a pass mark (60 % or 75 %). |
| **Derivation desk** | "Show that" problems: you derive on paper, then tick which key points you really had. |
| **Stations** | Predict, watch the simulation, explain. A wrong prediction cracks the bridge in the simulation. |
| **Fights** | Calculation problems in steps: first choose the right equation, then the algebra, last the numbers (with tolerance and a unit check). |
| **Boss gate** | A full old-exam problem, solved on paper under a timer, final answers entered. |

Some exercises are **locked** until an earlier one is passed (a door in the room opens when a room is cleared).

## XP, levels, ranks

- Each exercise has XP: lessons 5 to 25, derivations 20 to 35, quizzes 25 to 60, fights 15 to 90, bosses 60 to 150. A quiz pays XP in proportion to your score.
- A **hint costs 5 XP**. A step answered **right on the first try gives +3 XP** extra. A correct **prediction at a station gives 10 XP**.
- XP only counts the first time (or in a respawn), so you cannot farm one exercise.
- **Level** = floor(sqrt(XP / 60)) + 1. The rank follows the level: Freshman, Student, Adept, Scholar, Researcher, Postdoc, Professor, Nobel candidate.
- **Achievements** (Profile) reward first steps, 10 / 50 / 100 passed exercises, streaks of 3 / 7 / 21 days, study hours and so on.

## Respawns (what you asked about)

A **respawn** is spaced repetition, the most effective known way to remember. The rule is simple:

1. When you **fail** an exercise (wrong answer, or you give up), it is marked to **respawn in 1 day**.
2. When it is due, it shows in **"Respawns due: n"**, in the **review portal** (west end of a room) and first in every **Quick session**.
3. Solve it again **cleanly** and it moves up a box: next due in **3 days**, then **7 days**, then **16 days**.
4. After the fourth clean pass it is **done for good** and disappears from the schedule.
5. Fail it again at any point and it starts over at 1 day.

That is the forgetting curve: you meet a thing again just when you would be about to forget it. Respawns are small and cheap (a few minutes each),
and they are the cheapest points you can collect, which is why the app puts them first. An exercise you failed counts as **not passed** (doors stay closed)
until you get it right once. If you do not want a respawn schedule for something, use **My pile** instead (below): no timer, no schedule.

## Every day

- **Daily missions** (Missions, or T): 5 small tasks a day, chosen by question type like the real exam (mixed multiple choice, connections between courses,
  a derivation or an estimation, an experiment or a lesson, an exam problem). On Sundays there is a mock exam as well. Mission XP gets a **streak bonus**
  (+5 % per streak day, up to +50 %), and finishing all of them gives +50 XP.
- **Streak:** days in a row with at least one mission done. One missed day per week is forgiven by the **weekly streak freeze** (it is used automatically; the week starts on Monday).
- **Daily goal:** reached by **10, 20 or 40 minutes working on exercises**, or by finishing **2, 4 or 8 exercises** (passed or not), whichever comes first (Profile > settings). Only real work counts as time:
  an exercise is open (lesson, quiz, experiment, derivation, fight, station, boss or a mission quiz), the exam hall, or a practice tab (drills, mixed practice, Feynman, calibration), and you touched the screen or keyboard in the last 5 minutes
  (20 minutes for derivations, bosses and the exam hall, which you do on paper). Menus, maps, lists, the formulas and just having the game open do not count. Reaching it shows a message.
- **Quick session** (Menu, Missions, or key Q): up to three exercises, the most overdue respawns first, then the next step of the guided route, usually 10 to 20 minutes (the button shows the estimate).
- **Notifications** (server, optional): a morning plan, a midday quick win, an evening streak reminder, a Sunday week in review. Each names the exact exercise; tap it to start now or to be reminded later.

## The Study hub (V)

- **Today** (the first tab; also in the Menu and linked from the missions screen): everything you did today: minutes against the goal, XP, which exercises you passed (with respawns cleared) and which you failed (they come back), the missions done, with times. Click an exercise to open it again.
- **This week:** minutes per day, exercises passed, progress per course, strongest and weakest area, exam pace.
- **Session planner:** tell it how much time you have (30 to 120 minutes); it builds a session: respawns, mistakes, your pile, new material in the course that needs it most.
- **Drills** (spot the error, limiting cases), **Mixed practice**, **Exam radar** (which topics appear how often in old exams), **Calibration** (how sure you were versus how right).
- **My pile:** exercises you keep ("☆ Keep for later") to look at whenever you want. No timer, no schedule.
- **Mistakes:** every wrong numeric answer is logged with the likely slip, so you can write down what you will do differently.
- **Weak spots:** rooms where you fail most.
- **Feynman:** explain a topic in your own words, then tick which key points you really covered (+10 XP).

## The Exam hall (X)

Mock exams per course: points, a timer, multiple choice plus problems. The mark is the **Swiss scale**: 50 % of the points = 4.0 (pass), 82.5 % = 6.0, linear in between and rounded to quarter marks.
Your results are kept in a history chart. Hints cost XP here too.

## Where things are saved

Your **profile** (XP, solved exercises, respawn schedule, streak, settings, mistakes, pile, study time) is a file on the server (`/var/lib/physics-rpg/profiles/default.json`),
mirrored in the browser. The **theme** and the **controls mode** are stored in the browser of each device. Details and backups: `deploy/README.md`.
