(() => {

    "use strict";


    // =========================================================
    // ELEMENTOS
    // =========================================================

    const canvas =
        document.getElementById("game-canvas");

    const ctx =
        canvas.getContext("2d");


    const screens = {

        start:
            document.getElementById("start-screen"),

        instructions:
            document.getElementById("instructions-screen"),

        game:
            document.getElementById("game-screen"),

        end:
            document.getElementById("end-screen")

    };


    const playBtn =
        document.getElementById("play-btn");

    const startGameBtn =
        document.getElementById("start-game-btn");

    const restartBtn =
        document.getElementById("restart-btn");

    const continueStageBtn =
        document.getElementById("continue-stage-btn");

    const pauseBtn =
        document.getElementById("pause-btn");

    const resumeBtn =
        document.getElementById("resume-btn");

    const pauseRestartBtn =
        document.getElementById("pause-restart-btn");

    const soundBtn =
        document.getElementById("sound-btn");

    const reloadBtn =
        document.getElementById("reload-btn");

    const shootBtn =
        document.getElementById("shoot-btn");

    const joystickEl =
        document.getElementById("joystick");

    const joystickKnob =
        document.getElementById("joystick-knob");

    const continueLifeBtn =
        document.getElementById("continue-life-btn");


    const healthBar =
        document.getElementById("health-bar");

    const healthText =
        document.getElementById("health-text");

    const scoreText =
        document.getElementById("score-text");

    const stageText =
        document.getElementById("stage-text");

    const zombiesText =
        document.getElementById("zombies-text");

    const comboText =
        document.getElementById("combo-text");

    const highScoreText =
        document.getElementById("high-score-text");

    const startHighScore =
        document.getElementById("start-high-score");

    const ammoText =
        document.getElementById("ammo-text");

    const ammoDots =
        document.getElementById("ammo-dots");

    const effectText =
        document.getElementById("effect-text");


    const stageBanner =
        document.getElementById("stage-banner");

    const stageBannerTitle =
        document.getElementById("stage-banner-title");

    const stageBannerSubtitle =
        document.getElementById("stage-banner-subtitle");


    const bossHud =
        document.getElementById("boss-hud");

    const bossBar =
        document.getElementById("boss-bar");


    const intermissionOverlay =
        document.getElementById("intermission-overlay");

    const intermissionTitle =
        document.getElementById("intermission-title");

    const intermissionText =
        document.getElementById("intermission-text");

    const intermissionScore =
        document.getElementById("intermission-score");


    const pauseOverlay =
        document.getElementById("pause-overlay");


    const endKicker =
        document.getElementById("end-kicker");

    const endTitle =
        document.getElementById("end-title");

    const endMessage =
        document.getElementById("end-message");

    const finalScoreText =
        document.getElementById("final-score-text");

    const finalHighScoreText =
        document.getElementById("final-high-score-text");


    // =========================================================
    // CONFIGURAÇÕES
    // =========================================================

    const MAX_HEALTH = 50;

    const MAX_AMMO = 10;

    const COMBO_WINDOW = 2200;

    const STORAGE_KEY =
        "zombieOutlawsHighScore";


    // =========================================================
    // FASES
    // =========================================================

    const stages = [

        {
            name:
                "Rua Principal",

            subtitle:
                "A cidade foi tomada.",

            total:
                8,

            spawnDelay:
                1050,

            speed:
                66,

            background: [
                "#a3663a",
                "#d19b57",
                "#633d24"
            ],

            weights: {
                walker: 1,
                runner: 0,
                brute: 0
            },

            obstacleType:
                "crate"
        },


        {
            name:
                "Fazenda Abandonada",

            subtitle:
                "Eles estão vindo do milharal.",

            total:
                12,

            spawnDelay:
                860,

            speed:
                72,

            background: [
                "#7d6a3c",
                "#b39a54",
                "#524525"
            ],

            weights: {
                walker: 0.65,
                runner: 0.35,
                brute: 0
            },

            obstacleType:
                "hay"
        },


        {
            name:
                "Mina Assombrada",

            subtitle:
                "A escuridão não está vazia.",

            total:
                16,

            spawnDelay:
                720,

            speed:
                78,

            background: [
                "#423833",
                "#55473e",
                "#211b18"
            ],

            weights: {
                walker: 0.5,
                runner: 0.25,
                brute: 0.25
            },

            obstacleType:
                "pillar"
        },


        {
            name:
                "Desfiladeiro",

            subtitle:
                "Não há muito espaço para fugir.",

            total:
                20,

            spawnDelay:
                590,

            speed:
                86,

            background: [
                "#9b5531",
                "#c06f3e",
                "#603021"
            ],

            weights: {
                walker: 0.4,
                runner: 0.35,
                brute: 0.25
            },

            obstacleType:
                "rock"
        },


        {
            name:
                "Último Trem",

            subtitle:
                "A última horda chegou.",

            total:
                14,

            spawnDelay:
                500,

            speed:
                94,

            background: [
                "#382428",
                "#693b31",
                "#211719"
            ],

            weights: {
                walker: 0.35,
                runner: 0.4,
                brute: 0.25
            },

            obstacleType:
                "train"
        }

    ];


    // =========================================================
    // TIPOS DE ZUMBI
    // =========================================================

    const enemyPresets = {

        walker: {

            radius:
                18,

            hp:
                1,

            speedMultiplier:
                1,

            damage:
                10,

            score:
                5,

            body:
                "#5e7d47",

            head:
                "#6d8b57"

        },


        runner: {

            radius:
                15,

            hp:
                1,

            speedMultiplier:
                1.55,

            damage:
                8,

            score:
                5,

            body:
                "#748d45",

            head:
                "#839b59"

        },


        brute: {

            radius:
                28,

            hp:
                3,

            speedMultiplier:
                0.72,

            damage:
                15,

            score:
                10,

            body:
                "#4c6538",

            head:
                "#607a4a"

        }

    };


    // =========================================================
    // ESTADO
    // =========================================================

    const state = {

        phase:
            "menu",

        stage:
            0,

        score:
            0,

        highScore:
            loadHighScore(),

        stageStartScore:
            0,

        spawned:
            0,

        killed:
            0,

        lastSpawn:
            0,

        lastFrame:
            performance.now(),

        combo:
            0,

        comboUntil:
            0,

        shake:
            0,

        bossSpawned:
            false,

        bossDefeated:
            false,

        nextStageIndex:
            0,

        rapidFireUntil:
            0,

        soundOn:
            true,

        orientationBlocked:
            false,

        continues:
            1

    };


    // =========================================================
    // JOGADOR
    // =========================================================

    const player = {

        x:
            0,

        y:
            0,

        radius:
            18,

        speed:
            235,

        health:
            MAX_HEALTH,

        ammo:
            MAX_AMMO,

        reloadUntil:
            0,

        nextShot:
            0,

        invulnerableUntil:
            0,

        direction:
            1,

        walking:
            false,

        walkTime:
            0,

        recoilUntil:
            0

    };


    const keys = {

        up:
            false,

        down:
            false,

        left:
            false,

        right:
            false

    };


    let pointer = {

        x:
            0,

        y:
            0,

        active:
            false

    };


    const joystick = {

        x:
            0,

        y:
            0,

        active:
            false,

        pointerId:
            null

    };


    let audioContext =
        null;


    let mobilePointer =

        window
            .matchMedia(
                "(pointer: coarse)"
            )
            .matches;


    const bullets = [];

    const zombies = [];

    const particles = [];

    const pickups = [];

    const obstacles = [];


    // =========================================================
    // ÁUDIO OFFLINE
    // =========================================================

    function ensureAudio() {

        if (!state.soundOn) {
            return;
        }


        try {

            if (!audioContext) {

                audioContext =
                    new (
                        window.AudioContext
                        ||
                        window.webkitAudioContext
                    )();

            }


            if (
                audioContext.state
                ===
                "suspended"
            ) {

                audioContext.resume();

            }

        }

        catch (_) {

            audioContext =
                null;

        }

    }


    function tone(
        freq,
        duration = 0.08,
        type = "square",
        volume = 0.035,
        slideTo = null
    ) {

        if (!state.soundOn) {
            return;
        }


        ensureAudio();


        if (!audioContext) {
            return;
        }


        const now =
            audioContext.currentTime;


        const oscillator =
            audioContext
                .createOscillator();


        const gain =
            audioContext
                .createGain();


        oscillator.type =
            type;


        oscillator.frequency
            .setValueAtTime(
                freq,
                now
            );


        if (
            slideTo !== null
        ) {

            oscillator.frequency
                .exponentialRampToValueAtTime(

                    Math.max(
                        20,
                        slideTo
                    ),

                    now + duration

                );

        }


        gain.gain
            .setValueAtTime(
                volume,
                now
            );


        gain.gain
            .exponentialRampToValueAtTime(

                0.0001,

                now + duration

            );


        oscillator.connect(
            gain
        );


        gain.connect(
            audioContext.destination
        );


        oscillator.start(
            now
        );


        oscillator.stop(
            now + duration
        );

    }


    function playSound(name) {

        if (!state.soundOn) {
            return;
        }


        if (
            name === "shoot"
        ) {

            tone(
                175,
                0.055,
                "square",
                0.05,
                72
            );

        }


        else if (
            name === "hit"
        ) {

            tone(
                115,
                0.05,
                "sawtooth",
                0.025,
                70
            );

        }


        else if (
            name === "hurt"
        ) {

            tone(
                85,
                0.16,
                "sawtooth",
                0.035,
                45
            );

        }


        else if (
            name === "pickup"
        ) {

            tone(
                520,
                0.08,
                "sine",
                0.04,
                760
            );

        }


        else if (
            name === "reload"
        ) {

            tone(
                320,
                0.05,
                "square",
                0.025,
                250
            );


            setTimeout(
                () => {

                    tone(
                        420,
                        0.05,
                        "square",
                        0.025,
                        350
                    );

                },

                220
            );

        }


        else if (
            name === "stage"
        ) {

            tone(
                360,
                0.08,
                "triangle",
                0.035,
                500
            );


            setTimeout(
                () => {

                    tone(
                        520,
                        0.12,
                        "triangle",
                        0.035,
                        720
                    );

                },

                100
            );

        }


        else if (
            name === "boss"
        ) {

            tone(
                80,
                0.35,
                "sawtooth",
                0.055,
                48
            );

        }


        else if (
            name === "win"
        ) {

            tone(
                420,
                0.12,
                "triangle",
                0.04,
                540
            );


            setTimeout(
                () => {

                    tone(
                        540,
                        0.12,
                        "triangle",
                        0.04,
                        680
                    );

                },

                130
            );


            setTimeout(
                () => {

                    tone(
                        680,
                        0.2,
                        "triangle",
                        0.04,
                        860
                    );

                },

                260
            );

        }

    }


    // =========================================================
    // RECORDE LOCAL
    // =========================================================

    function loadHighScore() {

        try {

            const value =
                Number(
                    localStorage.getItem(
                        STORAGE_KEY
                    )
                );


            return Number.isFinite(
                value
            )
                ? value
                : 0;

        }

        catch (_) {

            return 0;

        }

    }


    function saveHighScore() {

        state.highScore =
            Math.max(
                state.highScore,
                state.score
            );


        try {

            localStorage.setItem(

                STORAGE_KEY,

                String(
                    state.highScore
                )

            );

        }

        catch (_) {

            // O jogo continua normalmente.

        }

    }


    // =========================================================
    // CANVAS
    // =========================================================

    function resizeCanvas() {

        const rect =
            canvas
                .getBoundingClientRect();


        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        canvas.width =
            Math.max(
                1,
                Math.floor(
                    rect.width * dpr
                )
            );


        canvas.height =
            Math.max(
                1,
                Math.floor(
                    rect.height * dpr
                )
            );


        ctx.setTransform(

            dpr,

            0,

            0,

            dpr,

            0,

            0

        );


        if (

            state.phase === "playing"

            ||

            state.phase === "paused"

            ||

            state.phase === "intermission"

        ) {

            clampPlayer();

        }

    }


    function gameWidth() {

        return canvas
            .getBoundingClientRect()
            .width;

    }


    function gameHeight() {

        return canvas
            .getBoundingClientRect()
            .height;

    }


    function showScreen(name) {

        Object
            .values(screens)
            .forEach(screen => {

                screen
                    .classList
                    .remove(
                        "active"
                    );

            });


        screens[name]
            .classList
            .add(
                "active"
            );


        if (
            name === "game"
        ) {

            requestAnimationFrame(
                () => {

                    resizeCanvas();

                    clampPlayer();

                }
            );

        }

    }


    // =========================================================
    // ORIENTAÇÃO
    // =========================================================

    function isPortrait() {

        return (
            window.innerHeight
            >
            window.innerWidth
        );

    }


    function refreshOrientationState() {

        const blocked =
            isPortrait();


        if (
            blocked
            !==
            state.orientationBlocked
        ) {

            state.orientationBlocked =
                blocked;


            state.lastFrame =
                performance.now();


            resetJoystick();


            keys.up =
                false;

            keys.down =
                false;

            keys.left =
                false;

            keys.right =
                false;

        }

    }


    // =========================================================
    // NOVO JOGO
    // =========================================================

    function resetGame() {

        state.phase =
            "playing";

        state.stage =
            0;

        state.score =
            0;

        state.stageStartScore =
            0;

        state.spawned =
            0;

        state.killed =
            0;

        state.lastSpawn =
            performance.now();

        state.lastFrame =
            performance.now();

        state.combo =
            0;

        state.comboUntil =
            0;

        state.shake =
            0;

        state.bossSpawned =
            false;

        state.bossDefeated =
            false;

        state.nextStageIndex =
            0;

        state.rapidFireUntil =
            0;

        state.continues =
            1;


        bullets.length =
            0;

        zombies.length =
            0;

        particles.length =
            0;

        pickups.length =
            0;

        obstacles.length =
            0;


        player.health =
            MAX_HEALTH;

        player.ammo =
            MAX_AMMO;

        player.reloadUntil =
            0;

        player.nextShot =
            0;

        player.invulnerableUntil =
            0;

        player.direction =
            1;

        player.walking =
            false;

        player.walkTime =
            0;

        player.recoilUntil =
            0;

        player.x =
            gameWidth() / 2;

        player.y =
            gameHeight() / 2;


        pointer.active =
            false;


        resetJoystick();


        pauseOverlay
            .classList
            .add("hidden");


        intermissionOverlay
            .classList
            .add("hidden");


        bossHud
            .classList
            .add("hidden");


        startStage(0);

    }


    // =========================================================
    // COMEÇAR FASE
    // =========================================================

    function startStage(index) {

        state.stage =
            index;

        state.stageStartScore =
            state.score;

        state.spawned =
            0;

        state.killed =
            0;

        state.lastSpawn =
            performance.now() + 450;

        state.combo =
            0;

        state.comboUntil =
            0;

        state.bossSpawned =
            false;

        state.bossDefeated =
            false;

        state.phase =
            "playing";


        bullets.length =
            0;

        zombies.length =
            0;

        pickups.length =
            0;

        particles.length =
            0;


        player.x =
            gameWidth() / 2;

        player.y =
            gameHeight() / 2;

        player.direction =
            1;


        createStageObstacles(
            index
        );


        const info =
            stages[index];


        stageBannerTitle.textContent =

            `FASE ${index + 1} — ${info.name}`;


        stageBannerSubtitle.textContent =

            info.subtitle;


        stageBanner
            .classList
            .add("show");


        setTimeout(
            () => {

                stageBanner
                    .classList
                    .remove("show");

            },

            1700
        );


        bossHud
            .classList
            .add("hidden");


        playSound(
            "stage"
        );


        updateHud();

    }


    // =========================================================
    // FIM DA FASE
    // =========================================================

    function completeStage() {

        if (
            state.phase
            !==
            "playing"
        ) {

            return;

        }


        if (
            state.stage
            ===
            stages.length - 1
        ) {

            if (
                !state.bossSpawned
            ) {

                spawnBoss();

            }

            return;

        }


        state.phase =
            "intermission";


        state.nextStageIndex =
            state.stage + 1;


        intermissionTitle.textContent =

            `${stages[state.stage].name} limpa!`;


        intermissionText.textContent =

            `Próxima parada: ${stages[state.nextStageIndex].name}.`;


        intermissionScore.textContent =

            Math.max(
                0,
                state.score
                -
                state.stageStartScore
            );


        intermissionOverlay
            .classList
            .remove("hidden");


        playSound(
            "stage"
        );

    }


    function continueToNextStage() {

        intermissionOverlay
            .classList
            .add("hidden");


        startStage(
            state.nextStageIndex
        );


        state.lastFrame =
            performance.now();

    }


    // =========================================================
    // VITÓRIA / DERROTA
    // =========================================================

    function finishGame(victory) {

        state.phase =
            "ended";


        saveHighScore();


        updateHud();


        finalScoreText.textContent =
            state.score;


        finalHighScoreText.textContent =
            state.highScore;


        startHighScore.textContent =
            state.highScore;


        if (victory) {

            endKicker.textContent =
                "VOCÊ SOBREVIVEU";


            endTitle.textContent =
                "O Oeste está a salvo!";


            endMessage.textContent =

                "Parabéns! Você atravessou as cinco fases e derrotou O Coveiro.";


            continueLifeBtn
                .classList
                .add("hidden");


            playSound(
                "win"
            );

        }


        else {

            endKicker.textContent =
                "FIM DE JOGO";


            endTitle.textContent =
                "A horda venceu...";


            endMessage.textContent =

                `Você chegou até a fase ${state.stage + 1}. Recarregue e tente novamente.`;


            continueLifeBtn
                .classList
                .toggle(

                    "hidden",

                    state.continues <= 0

                );


            continueLifeBtn.textContent =

                `CONTINUAR FASE (${state.continues})`;

        }


        showScreen(
            "end"
        );

    }


    // =========================================================
    // OBSTÁCULOS
    // =========================================================

    function createStageObstacles(stageIndex) {

        obstacles.length =
            0;


        const w =
            gameWidth();


        const h =
            gameHeight();


        const layouts = [

            [
                [0.18, 0.58, 56, 38],
                [0.75, 0.56, 62, 42],
                [0.32, 0.78, 48, 34]
            ],

            [
                [0.18, 0.55, 72, 34],
                [0.75, 0.67, 72, 34],
                [0.48, 0.82, 66, 30]
            ],

            [
                [0.20, 0.50, 42, 90],
                [0.80, 0.55, 42, 92],
                [0.50, 0.78, 52, 74]
            ],

            [
                [0.18, 0.62, 72, 58],
                [0.80, 0.50, 82, 64],
                [0.50, 0.80, 62, 48]
            ],

            [
                [0.19, 0.57, 86, 42],
                [0.76, 0.62, 92, 42],
                [0.48, 0.82, 74, 34]
            ]

        ];


        for (
            const [
                nx,
                ny,
                width,
                height
            ]
            of layouts[stageIndex]
        ) {

            obstacles.push({

                x:
                    nx * w
                    -
                    width / 2,

                y:
                    ny * h
                    -
                    height / 2,

                w:
                    width,

                h:
                    height,

                type:
                    stages[
                        stageIndex
                    ].obstacleType

            });

        }

    }


    function circleRectCollision(
        cx,
        cy,
        radius,
        rect
    ) {

        const closestX =
            Math.max(
                rect.x,
                Math.min(
                    cx,
                    rect.x + rect.w
                )
            );


        const closestY =
            Math.max(
                rect.y,
                Math.min(
                    cy,
                    rect.y + rect.h
                )
            );


        const dx =
            cx - closestX;


        const dy =
            cy - closestY;


        return (
            dx * dx
            +
            dy * dy
            <
            radius * radius
        );

    }


    function resolveCircleRect(
        entity,
        rect
    ) {

        const closestX =
            Math.max(
                rect.x,
                Math.min(
                    entity.x,
                    rect.x + rect.w
                )
            );


        const closestY =
            Math.max(
                rect.y,
                Math.min(
                    entity.y,
                    rect.y + rect.h
                )
            );


        let dx =
            entity.x
            -
            closestX;


        let dy =
            entity.y
            -
            closestY;


        let dist =
            Math.hypot(
                dx,
                dy
            );


        if (
            dist === 0
        ) {

            const left =
                Math.abs(
                    entity.x
                    -
                    rect.x
                );


            const right =
                Math.abs(
                    entity.x
                    -
                    (
                        rect.x
                        +
                        rect.w
                    )
                );


            const top =
                Math.abs(
                    entity.y
                    -
                    rect.y
                );


            const bottom =
                Math.abs(
                    entity.y
                    -
                    (
                        rect.y
                        +
                        rect.h
                    )
                );


            const min =
                Math.min(
                    left,
                    right,
                    top,
                    bottom
                );


            if (
                min === left
            ) {

                entity.x =
                    rect.x
                    -
                    entity.radius;

            }


            else if (
                min === right
            ) {

                entity.x =
                    rect.x
                    +
                    rect.w
                    +
                    entity.radius;

            }


            else if (
                min === top
            ) {

                entity.y =
                    rect.y
                    -
                    entity.radius;

            }


            else {

                entity.y =
                    rect.y
                    +
                    rect.h
                    +
                    entity.radius;

            }


            return;

        }


        if (
            dist
            <
            entity.radius
        ) {

            const overlap =
                entity.radius
                -
                dist;


            dx /=
                dist;


            dy /=
                dist;


            entity.x +=
                dx * overlap;


            entity.y +=
                dy * overlap;

        }

    }


    // =========================================================
    // ESCOLHER TIPO DE ZUMBI
    // =========================================================

    function chooseEnemyType() {

        const weights =
            stages[
                state.stage
            ].weights;


        const roll =
            Math.random();


        let sum =
            0;


        for (
            const type
            of [
                "walker",
                "runner",
                "brute"
            ]
        ) {

            sum +=
                weights[type] || 0;


            if (
                roll <= sum
            ) {

                return type;

            }

        }


        return "walker";

    }


    function randomEdgePosition(
        margin = 45
    ) {

        const side =
            Math.floor(
                Math.random() * 4
            );


        if (
            side === 0
        ) {

            return {

                x:
                    Math.random()
                    *
                    gameWidth(),

                y:
                    -margin

            };

        }


        if (
            side === 1
        ) {

            return {

                x:
                    gameWidth()
                    +
                    margin,

                y:
                    Math.random()
                    *
                    gameHeight()

            };

        }


        if (
            side === 2
        ) {

            return {

                x:
                    Math.random()
                    *
                    gameWidth(),

                y:
                    gameHeight()
                    +
                    margin

            };

        }


        return {

            x:
                -margin,

            y:
                Math.random()
                *
                gameHeight()

        };

    }


    // =========================================================
    // CRIAR ZUMBI
    // =========================================================

    function spawnZombie(
        forcedType = null,
        x = null,
        y = null,
        countsTowardWave = true
    ) {

        const type =
            forcedType
            ||
            chooseEnemyType();


        const preset =
            enemyPresets[type];


        const pos =

            x === null
            ||
            y === null

                ? randomEdgePosition()

                : {
                    x,
                    y
                };


        zombies.push({

            type,

            x:
                pos.x,

            y:
                pos.y,

            radius:
                preset.radius,

            hp:
                preset.hp,

            maxHp:
                preset.hp,

            speed:
                stages[state.stage].speed
                *
                preset.speedMultiplier,

            damage:
                preset.damage,

            score:
                preset.score,

            body:
                preset.body,

            head:
                preset.head,

            seed:
                Math.random()
                *
                Math.PI
                *
                2,

            hitFlashUntil:
                0,

            knockX:
                0,

            knockY:
                0,

            boss:
                false,

            countsTowardWave,

            nextSummon:
                0,

            nextCharge:
                0,

            chargeUntil:
                0

        });


        if (
            countsTowardWave
        ) {

            state.spawned++;

        }


        updateHud();

    }


    // =========================================================
    // BOSS
    // =========================================================

    function spawnBoss() {

        if (
            state.bossSpawned
        ) {

            return;

        }


        state.bossSpawned =
            true;


        state.combo =
            0;


        state.comboUntil =
            0;


        const boss = {

            type:
                "boss",

            x:
                gameWidth() / 2,

            y:
                -60,

            radius:
                42,

            hp:
                36,

            maxHp:
                36,

            speed:
                54,

            damage:
                20,

            score:
                100,

            body:
                "#3d5031",

            head:
                "#566a44",

            seed:
                Math.random()
                *
                Math.PI
                *
                2,

            hitFlashUntil:
                0,

            knockX:
                0,

            knockY:
                0,

            boss:
                true,

            countsTowardWave:
                false,

            nextSummon:
                performance.now()
                +
                2600,

            nextCharge:
                performance.now()
                +
                3400,

            chargeUntil:
                0

        };


        zombies.push(
            boss
        );


        bossHud
            .classList
            .remove("hidden");


        bossBar.style.width =
            "100%";


        stageBannerTitle.textContent =
            "CHEFE FINAL — O COVEIRO";


        stageBannerSubtitle.textContent =
            "Sobreviva ao último confronto.";


        stageBanner
            .classList
            .add("show");


        setTimeout(
            () => {

                stageBanner
                    .classList
                    .remove("show");

            },

            2200
        );


        state.shake =
            9;


        playSound(
            "boss"
        );


        updateHud();

    }


    function bossSummon(
        boss
    ) {

        const count =
            2;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                Math.random()
                *
                Math.PI
                *
                2;


            const distance =
                70
                +
                Math.random()
                *
                45;


            const type =

                Math.random()
                <
                0.55

                    ? "walker"

                    : "runner";


            spawnZombie(

                type,

                boss.x
                +
                Math.cos(angle)
                *
                distance,

                boss.y
                +
                Math.sin(angle)
                *
                distance,

                false

            );

        }


        stageBannerTitle.textContent =
            "O COVEIRO CHAMOU REFORÇOS";


        stageBannerSubtitle.textContent =
            "Não deixe a arena lotar.";


        stageBanner
            .classList
            .add("show");


        setTimeout(
            () => {

                stageBanner
                    .classList
                    .remove("show");

            },

            950
        );

    }


    // =========================================================
    // DANO NOS INIMIGOS
    // =========================================================

    function damageEnemy(
        enemy,
        damage,
        bullet
    ) {

        enemy.hp -=
            damage;


        enemy.hitFlashUntil =
            performance.now()
            +
            90;


        enemy.knockX +=
            bullet.vx
            *
            0.035;


        enemy.knockY +=
            bullet.vy
            *
            0.035;


        createParticles(

            bullet.x,

            bullet.y,

            "#e7d49a",

            4

        );


        playSound(
            "hit"
        );


        if (
            enemy.boss
        ) {

            bossBar.style.width =

                `${
                    Math.max(
                        0,
                        enemy.hp
                        /
                        enemy.maxHp
                    )
                    *
                    100
                }%`;


            state.shake =
                Math.max(
                    state.shake,
                    2.5
                );

        }


        if (
            enemy.hp <= 0
        ) {

            killEnemy(
                enemy
            );

        }

    }


    // =========================================================
    // MATAR INIMIGO
    // =========================================================

    function killEnemy(
        enemy
    ) {

        const index =
            zombies
                .indexOf(
                    enemy
                );


        if (
            index === -1
        ) {

            return;

        }


        if (
            enemy.boss
        ) {

            state.score +=
                enemy.score;


            state.highScore =
                Math.max(
                    state.highScore,
                    state.score
                );


            createParticles(

                enemy.x,

                enemy.y,

                "#8da76e",

                28

            );


            zombies.splice(
                index,
                1
            );


            bossHud
                .classList
                .add("hidden");


            state.bossDefeated =
                true;


            updateHud();


            finishGame(
                true
            );


            return;

        }


        const now =
            performance.now();


        if (
            now
            <=
            state.comboUntil
        ) {

            state.combo +=
                1;

        }


        else {

            state.combo =
                1;

        }


        state.comboUntil =
            now
            +
            COMBO_WINDOW;


        const multiplier =
            comboMultiplier();


        const comboBonus =
            Math.max(
                0,
                multiplier - 1
            )
            *
            2;


        state.score +=
            enemy.score
            +
            comboBonus;


        state.highScore =
            Math.max(
                state.highScore,
                state.score
            );


        if (
            enemy.countsTowardWave
        ) {

            state.killed++;

        }


        createParticles(

            enemy.x,

            enemy.y,

            enemy.type === "brute"
                ? "#829966"
                : "#6f8f55",

            enemy.type === "brute"
                ? 16
                : 10

        );


        maybeDropPickup(
            enemy.x,
            enemy.y
        );


        zombies.splice(
            index,
            1
        );


        updateHud();


        const stage =
            stages[state.stage];


        const remainingWaveEnemies =

            zombies.filter(

                z =>
                    !z.boss
                    &&
                    z.countsTowardWave

            ).length;


        if (

            state.killed
            >=
            stage.total

            &&

            state.spawned
            >=
            stage.total

            &&

            remainingWaveEnemies
            ===
            0

        ) {

            completeStage();

        }

    }


    // =========================================================
    // COMBO
    // =========================================================

    function comboMultiplier() {

        if (
            state.combo >= 9
        ) {

            return 4;

        }


        if (
            state.combo >= 6
        ) {

            return 3;

        }


        if (
            state.combo >= 3
        ) {

            return 2;

        }


        return 1;

    }


    // =========================================================
    // PICKUPS
    // =========================================================

    function maybeDropPickup(
        x,
        y
    ) {

        if (
            Math.random() > 0.2
        ) {

            return;

        }


        const roll =
            Math.random();


        let type =
            "ammo";


        if (
            roll < 0.34
        ) {

            type =
                "health";

        }


        else if (
            roll < 0.68
        ) {

            type =
                "ammo";

        }


        else {

            type =
                "rapid";

        }


        pickups.push({

            x,

            y,

            radius:
                14,

            type,

            expiresAt:
                performance.now()
                +
                8500,

            bob:
                Math.random()
                *
                Math.PI
                *
                2

        });

    }


    function collectPickup(
        pickup
    ) {

        if (
            pickup.type
            ===
            "health"
        ) {

            player.health =
                Math.min(
                    MAX_HEALTH,
                    player.health + 15
                );


            stageBannerTitle.textContent =
                "+15 DE VIDA";


            stageBannerSubtitle.textContent =
                "Você recuperou o fôlego.";

        }


        else if (
            pickup.type
            ===
            "ammo"
        ) {

            player.ammo =
                MAX_AMMO;


            player.reloadUntil =
                0;


            stageBannerTitle.textContent =
                "MUNIÇÃO CHEIA";


            stageBannerSubtitle.textContent =
                "Tambor recarregado.";

        }


        else {

            state.rapidFireUntil =
                performance.now()
                +
                7000;


            stageBannerTitle.textContent =
                "TIRO RÁPIDO";


            stageBannerSubtitle.textContent =
                "Cadência aumentada por alguns segundos.";

        }


        stageBanner
            .classList
            .add("show");


        setTimeout(
            () => {

                stageBanner
                    .classList
                    .remove("show");

            },

            900
        );


        createParticles(

            pickup.x,

            pickup.y,

            "#f2cf72",

            12

        );


        playSound(
            "pickup"
        );


        updateHud();

    }


    // =========================================================
    // ATIRAR
    // =========================================================

    function shoot(
        targetX,
        targetY
    ) {

        if (
            state.phase
            !==
            "playing"
            ||
            state.orientationBlocked
        ) {

            return;

        }


        const now =
            performance.now();


        const cooldown =

            now
            <
            state.rapidFireUntil

                ? 90

                : 170;


        if (
            now
            <
            player.nextShot
            ||
            now
            <
            player.reloadUntil
        ) {

            return;

        }


        if (
            player.ammo <= 0
        ) {

            reload();

            return;

        }


        let dx =
            targetX
            -
            player.x;


        let dy =
            targetY
            -
            player.y;


        const distance =
            Math.hypot(
                dx,
                dy
            )
            ||
            1;


        dx /=
            distance;


        dy /=
            distance;


        player.direction =

            dx >= 0

                ? 1

                : -1;


        player.ammo--;


        player.nextShot =
            now
            +
            cooldown;


        player.recoilUntil =
            now
            +
            90;


        bullets.push({

            x:
                player.x
                +
                dx * 32,

            y:
                player.y
                +
                dy * 9,

            vx:
                dx * 700,

            vy:
                dy * 700,

            radius:
                4,

            life:
                0.95,

            damage:
                1

        });


        createMuzzleFlash(

            player.x
            +
            dx * 38,

            player.y
            +
            dy * 9,

            dx,

            dy

        );


        playSound(
            "shoot"
        );


        updateHud();

    }


    // =========================================================
    // RECARREGAR
    // =========================================================

    function reload() {

        if (
            state.phase
            !==
            "playing"
        ) {

            return;

        }


        const now =
            performance.now();


        if (
            player.ammo
            ===
            MAX_AMMO
            ||
            now
            <
            player.reloadUntil
        ) {

            return;

        }


        player.reloadUntil =
            now
            +
            1100;


        ammoText.textContent =
            "RECARREGANDO";


        playSound(
            "reload"
        );


        setTimeout(
            () => {

                if (
                    state.phase
                    ===
                    "ended"
                ) {

                    return;

                }


                if (

                    performance.now()
                    >=
                    player.reloadUntil
                    -
                    40

                ) {

                    player.ammo =
                        MAX_AMMO;


                    player.reloadUntil =
                        0;


                    updateHud();

                }

            },

            1110
        );

    }


    // =========================================================
    // DANO NO PLAYER
    // =========================================================

    function damagePlayer(
        enemy
    ) {

        const now =
            performance.now();


        if (
            now
            <
            player.invulnerableUntil
            ||
            state.phase
            !==
            "playing"
        ) {

            return;

        }


        player.health -=
            enemy.damage;


        state.score =
            Math.max(
                0,
                state.score - 5
            );


        state.combo =
            0;


        state.comboUntil =
            0;


        player.invulnerableUntil =
            now
            +
            720;


        state.shake =
            Math.max(

                state.shake,

                enemy.boss
                    ? 11
                    : 7

            );


        createParticles(

            player.x,

            player.y,

            "#d85b48",

            12

        );


        playSound(
            "hurt"
        );


        updateHud();


        if (
            player.health <= 0
        ) {

            player.health =
                0;


            updateHud();


            finishGame(
                false
            );

        }

    }


    // =========================================================
    // UPDATE
    // =========================================================

    function update(
        dt,
        now
    ) {

        if (
            state.phase
            !==
            "playing"
            ||
            state.orientationBlocked
        ) {

            return;

        }


        if (
            state.combo > 0
            &&
            now
            >
            state.comboUntil
        ) {

            state.combo =
                0;


            updateHud();

        }


        if (
            state.shake > 0
        ) {

            state.shake =
                Math.max(
                    0,
                    state.shake
                    -
                    dt * 18
                );

        }


        player.walking =
            false;


        // =====================================================
        // SPAWN DA ONDA
        // =====================================================

        const stage =
            stages[state.stage];


        if (

            !state.bossSpawned

            &&

            state.spawned
            <
            stage.total

            &&

            now
            -
            state.lastSpawn
            >=
            stage.spawnDelay

        ) {

            spawnZombie();


            state.lastSpawn =
                now;

        }


        // =====================================================
        // MOVIMENTO DO PLAYER
        // =====================================================

        let moveX =
            joystick.x;


        let moveY =
            joystick.y;


        if (
            keys.left
        ) {

            moveX -=
                1;

        }


        if (
            keys.right
        ) {

            moveX +=
                1;

        }


        if (
            keys.up
        ) {

            moveY -=
                1;

        }


        if (
            keys.down
        ) {

            moveY +=
                1;

        }


        if (
            moveX !== 0
            ||
            moveY !== 0
        ) {

            const len =
                Math.hypot(
                    moveX,
                    moveY
                )
                ||
                1;


            if (
                len > 1
            ) {

                moveX /=
                    len;

                moveY /=
                    len;

            }


            player.x +=

                moveX
                *
                player.speed
                *
                dt;


            player.y +=

                moveY
                *
                player.speed
                *
                dt;


            player.walking =
                true;


            player.walkTime +=
                dt * 10;


            if (

                !pointer.active

                &&

                Math.abs(
                    moveX
                )
                >
                0.1

            ) {

                player.direction =

                    moveX >= 0

                        ? 1

                        : -1;

            }


            clampPlayer();


            for (
                const obstacle
                of obstacles
            ) {

                if (

                    circleRectCollision(

                        player.x,

                        player.y,

                        player.radius,

                        obstacle

                    )

                ) {

                    resolveCircleRect(

                        player,

                        obstacle

                    );

                }

            }

        }


        if (
            pointer.active
        ) {

            player.direction =

                pointer.x
                >=
                player.x

                    ? 1

                    : -1;

        }


        // =====================================================
        // BALAS
        // =====================================================

        for (

            let i =
                bullets.length - 1;

            i >= 0;

            i--

        ) {

            const bullet =
                bullets[i];


            bullet.x +=

                bullet.vx
                *
                dt;


            bullet.y +=

                bullet.vy
                *
                dt;


            bullet.life -=
                dt;


            if (

                bullet.life <= 0

                ||

                bullet.x < -30

                ||

                bullet.y < -30

                ||

                bullet.x
                >
                gameWidth() + 30

                ||

                bullet.y
                >
                gameHeight() + 30

            ) {

                bullets.splice(
                    i,
                    1
                );


                continue;

            }


            let obstacleHit =
                false;


            for (
                const obstacle
                of obstacles
            ) {

                if (

                    circleRectCollision(

                        bullet.x,

                        bullet.y,

                        bullet.radius,

                        obstacle

                    )

                ) {

                    createParticles(

                        bullet.x,

                        bullet.y,

                        "#c7aa79",

                        3

                    );


                    bullets.splice(
                        i,
                        1
                    );


                    obstacleHit =
                        true;


                    break;

                }

            }


            if (
                obstacleHit
            ) {

                continue;

            }


            let enemyHit =
                false;


            for (

                let j =
                    zombies.length - 1;

                j >= 0;

                j--

            ) {

                const enemy =
                    zombies[j];


                if (

                    circleCollision(

                        bullet.x,

                        bullet.y,

                        bullet.radius,

                        enemy.x,

                        enemy.y,

                        enemy.radius

                    )

                ) {

                    damageEnemy(

                        enemy,

                        bullet.damage,

                        bullet

                    );


                    bullets.splice(
                        i,
                        1
                    );


                    enemyHit =
                        true;


                    break;

                }

            }


            if (
                enemyHit
            ) {

                continue;

            }

        }


        // =====================================================
        // ZUMBIS / BOSS
        // =====================================================

        for (
            const enemy
            of [...zombies]
        ) {

            if (
                !zombies.includes(
                    enemy
                )
            ) {

                continue;

            }


            if (

                enemy.knockX !== 0

                ||

                enemy.knockY !== 0

            ) {

                enemy.x +=

                    enemy.knockX
                    *
                    dt;


                enemy.y +=

                    enemy.knockY
                    *
                    dt;


                enemy.knockX *=
                    0.82;


                enemy.knockY *=
                    0.82;


                if (
                    Math.abs(
                        enemy.knockX
                    )
                    <
                    1
                ) {

                    enemy.knockX =
                        0;

                }


                if (
                    Math.abs(
                        enemy.knockY
                    )
                    <
                    1
                ) {

                    enemy.knockY =
                        0;

                }

            }


            if (
                enemy.boss
            ) {

                if (
                    now
                    >=
                    enemy.nextSummon
                ) {

                    bossSummon(
                        enemy
                    );


                    enemy.nextSummon =
                        now
                        +
                        4800;

                }


                if (
                    now
                    >=
                    enemy.nextCharge
                ) {

                    enemy.chargeUntil =
                        now
                        +
                        760;


                    enemy.nextCharge =
                        now
                        +
                        4300;


                    stageBannerTitle.textContent =
                        "O COVEIRO AVANÇA";


                    stageBannerSubtitle.textContent =
                        "Saia da frente!";


                    stageBanner
                        .classList
                        .add("show");


                    setTimeout(
                        () => {

                            stageBanner
                                .classList
                                .remove("show");

                        },

                        700
                    );

                }

            }


            const dx =
                player.x
                -
                enemy.x;


            const dy =
                player.y
                -
                enemy.y;


            const distance =
                Math.hypot(
                    dx,
                    dy
                )
                ||
                1;


            const chargeMultiplier =

                enemy.boss

                &&

                now
                <
                enemy.chargeUntil

                    ? 2.1

                    : 1;


            enemy.x +=

                (
                    dx
                    /
                    distance
                )
                *
                enemy.speed
                *
                chargeMultiplier
                *
                dt;


            enemy.y +=

                (
                    dy
                    /
                    distance
                )
                *
                enemy.speed
                *
                chargeMultiplier
                *
                dt;


            for (
                const obstacle
                of obstacles
            ) {

                if (

                    circleRectCollision(

                        enemy.x,

                        enemy.y,

                        enemy.radius,

                        obstacle

                    )

                ) {

                    resolveCircleRect(

                        enemy,

                        obstacle

                    );

                }

            }


            if (

                circleCollision(

                    player.x,

                    player.y,

                    player.radius,

                    enemy.x,

                    enemy.y,

                    enemy.radius

                )

            ) {

                damagePlayer(
                    enemy
                );


                enemy.x -=

                    (
                        dx
                        /
                        distance
                    )

                    *

                    (
                        enemy.boss
                            ? 34
                            : 22
                    );


                enemy.y -=

                    (
                        dy
                        /
                        distance
                    )

                    *

                    (
                        enemy.boss
                            ? 34
                            : 22
                    );

            }

        }


        // =====================================================
        // PICKUPS
        // =====================================================

        for (

            let i =
                pickups.length - 1;

            i >= 0;

            i--

        ) {

            const pickup =
                pickups[i];


            pickup.bob +=
                dt * 4;


            if (
                now
                >
                pickup.expiresAt
            ) {

                pickups.splice(
                    i,
                    1
                );


                continue;

            }


            if (

                circleCollision(

                    player.x,

                    player.y,

                    player.radius,

                    pickup.x,

                    pickup.y,

                    pickup.radius

                )

            ) {

                collectPickup(
                    pickup
                );


                pickups.splice(
                    i,
                    1
                );

            }

        }


        // =====================================================
        // PARTÍCULAS
        // =====================================================

        for (

            let i =
                particles.length - 1;

            i >= 0;

            i--

        ) {

            const p =
                particles[i];


            p.x +=
                p.vx
                *
                dt;


            p.y +=
                p.vy
                *
                dt;


            p.vx *=
                0.97;


            p.vy *=
                0.97;


            p.life -=
                dt;


            if (
                p.life <= 0
            ) {

                particles.splice(
                    i,
                    1
                );

            }

        }


        // =====================================================
        // BOSS FINAL
        // =====================================================

        if (

            state.stage
            ===
            stages.length - 1

            &&

            !state.bossSpawned

            &&

            state.killed
            >=
            stages[state.stage].total

            &&

            state.spawned
            >=
            stages[state.stage].total

            &&

            zombies.filter(
                z =>
                    z.countsTowardWave
            ).length
            ===
            0

        ) {

            spawnBoss();

        }


        updateEffectText(
            now
        );

    }


    // =========================================================
    // DESENHO PRINCIPAL
    // =========================================================

    function draw() {

        if (

            !screens.game
                .classList
                .contains(
                    "active"
                )

        ) {

            return;

        }


        const shakeX =

            state.shake > 0

                ? (
                    Math.random() - 0.5
                )
                *
                state.shake

                : 0;


        const shakeY =

            state.shake > 0

                ? (
                    Math.random() - 0.5
                )
                *
                state.shake

                : 0;


        ctx.save();


        ctx.translate(
            shakeX,
            shakeY
        );


        drawBackground();

        drawObstacles();

        drawPickups();

        drawParticles();


        for (
            const enemy
            of zombies
        ) {

            drawZombie(
                enemy
            );

        }


        for (
            const bullet
            of bullets
        ) {

            drawBullet(
                bullet
            );

        }


        if (
            mobilePointer
        ) {

            drawTargetIndicator();

        }


        drawPlayer();

        drawReloadBar();


        ctx.restore();

    }


    // =========================================================
    // CENÁRIOS
    // =========================================================

    function drawBackground() {

        const width =
            gameWidth();


        const height =
            gameHeight();


        const [
            sky,
            ground,
            dark
        ] =
            stages[
                state.stage
            ].background;


        ctx.fillStyle =
            sky;


        ctx.fillRect(

            0,

            0,

            width,

            height * 0.43

        );


        ctx.fillStyle =
            ground;


        ctx.fillRect(

            0,

            height * 0.43,

            width,

            height * 0.57

        );


        // =====================================================
        // FASE 1
        // =====================================================

        if (
            state.stage === 0
        ) {

            ctx.fillStyle =
                dark;


            for (

                let x = 18;

                x < width;

                x += 150

            ) {

                ctx.fillRect(

                    x,

                    height * 0.26,

                    108,

                    height * 0.17

                );


                ctx.fillRect(

                    x + 18,

                    height * 0.22,

                    72,

                    22

                );


                ctx.fillStyle =
                    "#c58d49";


                ctx.fillRect(

                    x + 20,

                    height * 0.31,

                    18,

                    28

                );


                ctx.fillRect(

                    x + 65,

                    height * 0.31,

                    20,

                    20

                );


                ctx.fillStyle =
                    dark;

            }


            ctx.fillStyle =
                "rgba(95, 58, 34, 0.45)";


            ctx.beginPath();


            ctx.moveTo(

                width * 0.38,

                height * 0.43

            );


            ctx.lineTo(

                width * 0.62,

                height * 0.43

            );


            ctx.lineTo(

                width * 0.9,

                height

            );


            ctx.lineTo(

                width * 0.1,

                height

            );


            ctx.closePath();


            ctx.fill();

        }


        // =====================================================
        // FASE 2
        // =====================================================

        if (
            state.stage === 1
        ) {

            ctx.fillStyle =
                dark;


            ctx.fillRect(

                0,

                height * 0.38,

                width,

                8

            );


            for (

                let x = 12;

                x < width;

                x += 26

            ) {

                ctx.fillRect(

                    x,

                    height * 0.31
                    +
                    Math.sin(x) * 2,

                    4,

                    48

                );

            }


            ctx.fillRect(

                width * 0.72,

                height * 0.24,

                120,

                height * 0.19

            );


            ctx.beginPath();


            ctx.moveTo(

                width * 0.70,

                height * 0.24

            );


            ctx.lineTo(

                width * 0.82,

                height * 0.15

            );


            ctx.lineTo(

                width * 0.94,

                height * 0.24

            );


            ctx.fill();

        }


        // =====================================================
        // FASE 3
        // =====================================================

        if (
            state.stage === 2
        ) {

            ctx.fillStyle =
                "#171313";


            ctx.fillRect(

                0,

                0,

                width,

                height

            );


            const gradient =

                ctx.createRadialGradient(

                    width / 2,

                    height * 0.58,

                    20,

                    width / 2,

                    height * 0.58,

                    Math.max(
                        width,
                        height
                    )
                    *
                    0.75

                );


            gradient.addColorStop(

                0,

                "#75604c"

            );


            gradient.addColorStop(

                0.42,

                "#493d34"

            );


            gradient.addColorStop(

                1,

                "#171313"

            );


            ctx.fillStyle =
                gradient;


            ctx.fillRect(

                0,

                0,

                width,

                height

            );


            ctx.fillStyle =
                "#241b17";


            for (

                let x = 50;

                x < width;

                x += 180

            ) {

                ctx.fillRect(

                    x,

                    height * 0.14,

                    16,

                    height * 0.72

                );


                ctx.fillRect(

                    x - 35,

                    height * 0.16,

                    86,

                    12

                );

            }

        }


        // =====================================================
        // FASE 4
        // =====================================================

        if (
            state.stage === 3
        ) {

            ctx.fillStyle =
                dark;


            ctx.fillRect(

                0,

                0,

                width * 0.12,

                height

            );


            ctx.fillRect(

                width * 0.88,

                0,

                width * 0.12,

                height

            );


            ctx.fillStyle =
                "rgba(255, 220, 170, 0.08)";


            for (

                let y = 30;

                y < height;

                y += 60

            ) {

                ctx.fillRect(

                    0,

                    y,

                    width,

                    2

                );

            }

        }


        // =====================================================
        // FASE 5
        // =====================================================

        if (
            state.stage === 4
        ) {

            ctx.fillStyle =
                "#171011";


            ctx.fillRect(

                0,

                0,

                width,

                height

            );


            ctx.fillStyle =
                "#4e3228";


            ctx.fillRect(

                0,

                height * 0.42,

                width,

                height * 0.58

            );


            ctx.fillStyle =
                "#21191a";


            for (

                let x = 35;

                x < width;

                x += 145

            ) {

                ctx.fillRect(

                    x,

                    height * 0.31,

                    118,

                    54

                );


                ctx.fillStyle =
                    "#8c5330";


                ctx.fillRect(

                    x + 16,

                    height * 0.335,

                    18,

                    18

                );


                ctx.fillRect(

                    x + 49,

                    height * 0.335,

                    18,

                    18

                );


                ctx.fillStyle =
                    "#21191a";

            }


            ctx.fillStyle =
                "#2b211d";


            ctx.fillRect(

                0,

                height * 0.72,

                width,

                8

            );


            ctx.fillRect(

                0,

                height * 0.83,

                width,

                8

            );


            for (

                let x = 0;

                x < width;

                x += 46

            ) {

                ctx.fillRect(

                    x,

                    height * 0.70,

                    7,

                    height * 0.16

                );

            }

        }


        const vignette =

            ctx.createRadialGradient(

                width / 2,

                height / 2,

                Math.min(
                    width,
                    height
                )
                *
                0.12,

                width / 2,

                height / 2,

                Math.max(
                    width,
                    height
                )
                *
                0.72

            );


        vignette.addColorStop(

            0,

            "rgba(0,0,0,0)"

        );


        vignette.addColorStop(

            1,

            "rgba(0,0,0,0.35)"

        );


        ctx.fillStyle =
            vignette;


        ctx.fillRect(

            0,

            0,

            width,

            height

        );

    }


    // =========================================================
    // OBSTÁCULOS
    // =========================================================

    function drawObstacles() {

        for (
            const obstacle
            of obstacles
        ) {

            ctx.save();


            ctx.translate(

                obstacle.x,

                obstacle.y

            );


            if (
                obstacle.type
                ===
                "crate"
            ) {

                ctx.fillStyle =
                    "#6f4327";


                ctx.fillRect(

                    0,

                    0,

                    obstacle.w,

                    obstacle.h

                );


                ctx.strokeStyle =
                    "#9b6b3c";


                ctx.lineWidth =
                    4;


                ctx.strokeRect(

                    2,

                    2,

                    obstacle.w - 4,

                    obstacle.h - 4

                );


                ctx.beginPath();


                ctx.moveTo(
                    5,
                    5
                );


                ctx.lineTo(

                    obstacle.w - 5,

                    obstacle.h - 5

                );


                ctx.moveTo(

                    obstacle.w - 5,

                    5

                );


                ctx.lineTo(

                    5,

                    obstacle.h - 5

                );


                ctx.stroke();

            }


            else if (
                obstacle.type
                ===
                "hay"
            ) {

                ctx.fillStyle =
                    "#b58b3f";


                ctx.fillRect(

                    0,

                    0,

                    obstacle.w,

                    obstacle.h

                );


                ctx.strokeStyle =
                    "#d6ad56";


                ctx.lineWidth =
                    2;


                for (

                    let y = 7;

                    y < obstacle.h;

                    y += 8

                ) {

                    ctx.beginPath();


                    ctx.moveTo(

                        4,

                        y

                    );


                    ctx.lineTo(

                        obstacle.w - 4,

                        y + 3

                    );


                    ctx.stroke();

                }

            }


            else if (
                obstacle.type
                ===
                "pillar"
            ) {

                ctx.fillStyle =
                    "#352a24";


                ctx.fillRect(

                    0,

                    0,

                    obstacle.w,

                    obstacle.h

                );


                ctx.fillStyle =
                    "#5c4a3e";


                ctx.fillRect(

                    5,

                    0,

                    8,

                    obstacle.h

                );


                ctx.fillRect(

                    obstacle.w - 13,

                    0,

                    8,

                    obstacle.h

                );

            }


            else if (
                obstacle.type
                ===
                "rock"
            ) {

                ctx.fillStyle =
                    "#6f3d2b";


                ctx.beginPath();


                ctx.ellipse(

                    obstacle.w / 2,

                    obstacle.h / 2,

                    obstacle.w / 2,

                    obstacle.h / 2,

                    -0.2,

                    0,

                    Math.PI * 2

                );


                ctx.fill();


                ctx.fillStyle =
                    "rgba(255,255,255,0.08)";


                ctx.beginPath();


                ctx.ellipse(

                    obstacle.w * 0.4,

                    obstacle.h * 0.35,

                    obstacle.w * 0.2,

                    obstacle.h * 0.15,

                    -0.2,

                    0,

                    Math.PI * 2

                );


                ctx.fill();

            }


            else {

                ctx.fillStyle =
                    "#352625";


                ctx.fillRect(

                    0,

                    0,

                    obstacle.w,

                    obstacle.h

                );


                ctx.fillStyle =
                    "#70432e";


                ctx.fillRect(

                    6,

                    6,

                    obstacle.w - 12,

                    obstacle.h - 12

                );

            }


            ctx.restore();

        }

    }


    // =========================================================
    // COWBOY
    // =========================================================

    function drawPlayer() {

        const flashing =

            performance.now()
            <
            player.invulnerableUntil

            &&

            Math.floor(
                performance.now()
                /
                80
            )
            %
            2 === 0;


        const legSwing =

            player.walking

                ? Math.sin(
                    player.walkTime
                )
                *
                4

                : 0;


        const recoil =

            performance.now()
            <
            player.recoilUntil

                ? 4

                : 0;


        if (
            flashing
        ) {

            ctx.globalAlpha =
                0.45;

        }


        ctx.save();


        ctx.translate(

            player.x,

            player.y

        );


        // APENAS ESPELHA DIREITA / ESQUERDA

        ctx.scale(

            player.direction,

            1

        );


        // SOMBRA

        ctx.fillStyle =
            "rgba(0,0,0,0.28)";


        ctx.beginPath();


        ctx.ellipse(

            0,

            23,

            22,

            8,

            0,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // PERNAS

        ctx.fillStyle =
            "#332018";


        ctx.fillRect(

            -11
            +
            legSwing * 0.35,

            7,

            8,

            22

        );


        ctx.fillRect(

            4
            -
            legSwing * 0.35,

            7,

            8,

            22

        );


        // BOTAS

        ctx.fillStyle =
            "#1c120e";


        ctx.fillRect(

            -14
            +
            legSwing * 0.35,

            25,

            12,

            6

        );


        ctx.fillRect(

            4
            -
            legSwing * 0.35,

            25,

            12,

            6

        );


        // CORPO

        ctx.fillStyle =
            "#71321e";


        ctx.beginPath();


        ctx.arc(

            0,

            2,

            17,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // CINTO

        ctx.fillStyle =
            "#322015";


        ctx.fillRect(

            -16,

            8,

            32,

            5

        );


        // FIVELA

        ctx.fillStyle =
            "#c49b49";


        ctx.fillRect(

            -4,

            8,

            8,

            5

        );


        // CABEÇA

        ctx.fillStyle =
            "#d6a166";


        ctx.beginPath();


        ctx.arc(

            0,

            -15,

            11,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // LENÇO

        ctx.fillStyle =
            "#ad3029";


        ctx.fillRect(

            -8,

            -5,

            16,

            6

        );


        // CHAPÉU

        ctx.fillStyle =
            "#492918";


        ctx.fillRect(

            -16,

            -27,

            33,

            6

        );


        ctx.fillRect(

            -9,

            -35,

            19,

            10

        );


        // OLHO

        ctx.fillStyle =
            "#1c1410";


        ctx.fillRect(

            5,

            -17,

            3,

            3

        );


        // BRAÇO

        ctx.fillStyle =
            "#c58d58";


        ctx.fillRect(

            10 - recoil,

            -1,

            19,

            7

        );


        // REVÓLVER

        ctx.fillStyle =
            "#292929";


        ctx.fillRect(

            26 - recoil,

            -3,

            22,

            6

        );


        ctx.fillStyle =
            "#161616";


        ctx.fillRect(

            43 - recoil,

            -3,

            10,

            4

        );


        ctx.restore();


        ctx.globalAlpha =
            1;

    }


    // =========================================================
    // ZUMBIS
    // =========================================================

    function drawZombie(
        enemy
    ) {

        const now =
            performance.now();


        const bob =

            Math.sin(

                now * 0.006

                +

                enemy.seed

            )

            *

            (
                enemy.boss
                    ? 2
                    : 1.5
            );


        const hitFlash =

            now
            <
            enemy.hitFlashUntil;


        ctx.save();


        ctx.translate(

            enemy.x,

            enemy.y
            +
            bob

        );


        if (
            enemy.type
            ===
            "brute"
        ) {

            ctx.scale(
                1.18,
                1.18
            );

        }


        if (
            enemy.boss
        ) {

            ctx.scale(
                1.45,
                1.45
            );

        }


        // SOMBRA

        ctx.fillStyle =
            "rgba(0,0,0,0.22)";


        ctx.beginPath();


        ctx.ellipse(

            0,

            17,

            enemy.boss
                ? 25
                : 17,

            enemy.boss
                ? 10
                : 7,

            0,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // CORPO

        ctx.fillStyle =

            hitFlash

                ? "#d9d59b"

                : enemy.body;


        ctx.beginPath();


        ctx.arc(

            0,

            3,

            enemy.boss
                ? 21
                : 15,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // CABEÇA

        ctx.fillStyle =

            hitFlash

                ? "#e8e0ad"

                : enemy.head;


        ctx.beginPath();


        ctx.arc(

            0,

            enemy.boss
                ? -18
                : -12,

            enemy.boss
                ? 14
                : 10,

            0,

            Math.PI * 2

        );


        ctx.fill();


        // BRAÇOS

        ctx.strokeStyle =

            hitFlash

                ? "#ddd6a1"

                : enemy.head;


        ctx.lineWidth =

            enemy.boss
                ? 7
                : 5;


        ctx.beginPath();


        ctx.moveTo(
            -12,
            0
        );


        ctx.lineTo(

            -24,

            8
            +
            Math.sin(
                now * 0.009
                +
                enemy.seed
            )
            *
            4

        );


        ctx.moveTo(
            12,
            0
        );


        ctx.lineTo(

            24,

            7
            -
            Math.sin(
                now * 0.009
                +
                enemy.seed
            )
            *
            4

        );


        ctx.stroke();


        // OLHOS

        ctx.fillStyle =

            enemy.boss

                ? "#ffb35d"

                : "#ead069";


        ctx.fillRect(

            -6,

            enemy.boss
                ? -21
                : -15,

            3,

            3

        );


        ctx.fillRect(

            4,

            enemy.boss
                ? -21
                : -15,

            3,

            3

        );


        // CORREDOR

        if (
            enemy.type
            ===
            "runner"
        ) {

            ctx.fillStyle =
                "#4b241d";


            ctx.fillRect(

                -12,

                9,

                8,

                15

            );


            ctx.fillRect(

                4,

                9,

                8,

                15

            );

        }


        // VIDA DO BRUTAMONTE

        if (

            enemy.type
            ===
            "brute"

            &&

            enemy.hp
            <
            enemy.maxHp

        ) {

            drawEnemyMiniBar(

                enemy,

                -16,

                -32,

                32

            );

        }


        // CHAPÉU DO BOSS

        if (
            enemy.boss
        ) {

            ctx.fillStyle =
                "#2b1b16";


            ctx.fillRect(

                -15,

                -35,

                30,

                7

            );


            ctx.fillRect(

                -9,

                -44,

                18,

                11

            );

        }


        ctx.restore();

    }


    function drawEnemyMiniBar(
        enemy,
        x,
        y,
        width
    ) {

        ctx.fillStyle =
            "rgba(0,0,0,0.42)";


        ctx.fillRect(

            x,

            y,

            width,

            5

        );


        ctx.fillStyle =
            "#b84339";


        ctx.fillRect(

            x,

            y,

            width
            *
            Math.max(

                0,

                enemy.hp
                /
                enemy.maxHp

            ),

            5

        );

    }


    // =========================================================
    // BALAS
    // =========================================================

    function drawBullet(
        bullet
    ) {

        ctx.fillStyle =
            "#ffe89b";


        ctx.shadowColor =
            "#ffd35c";


        ctx.shadowBlur =
            10;


        ctx.beginPath();


        ctx.arc(

            bullet.x,

            bullet.y,

            bullet.radius,

            0,

            Math.PI * 2

        );


        ctx.fill();


        ctx.shadowBlur =
            0;

    }


    // =========================================================
    // PARTÍCULAS
    // =========================================================

    function drawParticles() {

        for (
            const p
            of particles
        ) {

            ctx.globalAlpha =

                Math.max(

                    0,

                    p.life
                    /
                    p.maxLife

                );


            ctx.fillStyle =
                p.color;


            ctx.beginPath();


            ctx.arc(

                p.x,

                p.y,

                p.size,

                0,

                Math.PI * 2

            );


            ctx.fill();

        }


        ctx.globalAlpha =
            1;

    }


    // =========================================================
    // PICKUPS
    // =========================================================

    function drawPickups() {

        const now =
            performance.now();


        for (
            const pickup
            of pickups
        ) {

            const y =

                pickup.y

                +

                Math.sin(
                    pickup.bob
                )
                *
                4;


            ctx.save();


            ctx.translate(

                pickup.x,

                y

            );


            // SOMBRA

            ctx.fillStyle =
                "rgba(0,0,0,0.22)";


            ctx.beginPath();


            ctx.ellipse(

                0,

                13,

                14,

                6,

                0,

                0,

                Math.PI * 2

            );


            ctx.fill();


            // VIDA

            if (
                pickup.type
                ===
                "health"
            ) {

                ctx.fillStyle =
                    "#c94e43";


                ctx.fillRect(

                    -11,

                    -11,

                    22,

                    22

                );


                ctx.fillStyle =
                    "#f2e2c1";


                ctx.fillRect(

                    -3,

                    -8,

                    6,

                    16

                );


                ctx.fillRect(

                    -8,

                    -3,

                    16,

                    6

                );

            }


            // MUNIÇÃO

            else if (
                pickup.type
                ===
                "ammo"
            ) {

                ctx.fillStyle =
                    "#d9a746";


                ctx.fillRect(

                    -10,

                    -12,

                    7,

                    24

                );


                ctx.fillRect(

                    2,

                    -12,

                    7,

                    24

                );


                ctx.fillStyle =
                    "#7a4b20";


                ctx.fillRect(

                    -10,

                    7,

                    7,

                    5

                );


                ctx.fillRect(

                    2,

                    7,

                    7,

                    5

                );

            }


            // TIRO RÁPIDO

            else {

                ctx.fillStyle =
                    "#e4c45c";


                ctx.beginPath();


                for (

                    let i = 0;

                    i < 10;

                    i++

                ) {

                    const angle =

                        -Math.PI / 2

                        +

                        i
                        *
                        Math.PI
                        /
                        5;


                    const radius =

                        i % 2 === 0

                            ? 13

                            : 6;


                    const x =
                        Math.cos(angle)
                        *
                        radius;


                    const py =
                        Math.sin(angle)
                        *
                        radius;


                    if (
                        i === 0
                    ) {

                        ctx.moveTo(
                            x,
                            py
                        );

                    }

                    else {

                        ctx.lineTo(
                            x,
                            py
                        );

                    }

                }


                ctx.closePath();


                ctx.fill();

            }


            if (

                pickup.expiresAt
                -
                now
                <
                2200

                &&

                Math.floor(
                    now / 140
                )
                %
                2 === 0

            ) {

                ctx.globalAlpha =
                    0.35;

            }


            ctx.restore();


            ctx.globalAlpha =
                1;

        }

    }


    // =========================================================
    // BARRA DE RECARGA
    // =========================================================

    function drawReloadBar() {

        const now =
            performance.now();


        if (
            now
            >=
            player.reloadUntil
            ||
            player.reloadUntil
            ===
            0
        ) {

            return;

        }


        const total =
            1100;


        const remaining =
            Math.max(

                0,

                player.reloadUntil
                -
                now

            );


        const progress =
            1
            -
            remaining
            /
            total;


        const width =
            64;


        const x =
            player.x
            -
            width / 2;


        const y =
            player.y
            -
            52;


        ctx.fillStyle =
            "rgba(0,0,0,0.58)";


        ctx.fillRect(

            x,

            y,

            width,

            7

        );


        ctx.fillStyle =
            "#e4b05a";


        ctx.fillRect(

            x,

            y,

            width * progress,

            7

        );

    }


    // =========================================================
    // MIRA MOBILE
    // =========================================================

    function drawTargetIndicator() {

        const target =
            nearestZombie();


        if (
            !target
        ) {

            return;

        }


        ctx.save();


        ctx.strokeStyle =
            "rgba(255, 220, 140, 0.72)";


        ctx.lineWidth =
            2;


        ctx.setLineDash(
            [5, 5]
        );


        ctx.beginPath();


        ctx.arc(

            target.x,

            target.y,

            target.radius + 9,

            0,

            Math.PI * 2

        );


        ctx.stroke();


        ctx.restore();

    }


    // =========================================================
    // CRIAR PARTÍCULAS
    // =========================================================

    function createParticles(
        x,
        y,
        color,
        amount
    ) {

        for (

            let i = 0;

            i < amount;

            i++

        ) {

            const angle =
                Math.random()
                *
                Math.PI
                *
                2;


            const speed =
                30
                +
                Math.random()
                *
                100;


            const life =
                0.18
                +
                Math.random()
                *
                0.32;


            particles.push({

                x,

                y,

                vx:
                    Math.cos(angle)
                    *
                    speed,

                vy:
                    Math.sin(angle)
                    *
                    speed,

                size:
                    2
                    +
                    Math.random()
                    *
                    3,

                color,

                life,

                maxLife:
                    life

            });

        }

    }


    function createMuzzleFlash(
        x,
        y,
        dx,
        dy
    ) {

        for (

            let i = 0;

            i < 6;

            i++

        ) {

            const spread =
                (
                    Math.random()
                    -
                    0.5
                )
                *
                0.5;


            const baseAngle =

                Math.atan2(
                    dy,
                    dx
                )

                +

                spread;


            const speed =
                70
                +
                Math.random()
                *
                120;


            const life =
                0.06
                +
                Math.random()
                *
                0.08;


            particles.push({

                x,

                y,

                vx:
                    Math.cos(
                        baseAngle
                    )
                    *
                    speed,

                vy:
                    Math.sin(
                        baseAngle
                    )
                    *
                    speed,

                size:
                    2
                    +
                    Math.random()
                    *
                    3,

                color:
                    "#ffd36f",

                life,

                maxLife:
                    life

            });

        }

    }


    // =========================================================
    // HUD
    // =========================================================

    function updateHud() {

        healthText.textContent =

            `${Math.max(
                0,
                player.health
            )}/${MAX_HEALTH}`;


        healthBar.style.width =

            `${
                Math.max(

                    0,

                    player.health
                    /
                    MAX_HEALTH

                )
                *
                100
            }%`;


        scoreText.textContent =
            state.score;


        stageText.textContent =

            `${state.stage + 1}/5`;


        highScoreText.textContent =

            Math.max(
                state.highScore,
                state.score
            );


        startHighScore.textContent =

            Math.max(
                state.highScore,
                state.score
            );


        const multiplier =
            comboMultiplier();


        comboText.textContent =
            `x${multiplier}`;


        comboText
            .classList
            .toggle(

                "hot",

                multiplier > 1

            );


        const stage =
            stages[state.stage];


        const remaining =

            Math.max(

                0,

                stage.total
                -
                state.killed

            );


        zombiesText.textContent =

            state.bossSpawned

                ? "CHEFE"

                : remaining;


        if (

            performance.now()
            >=
            player.reloadUntil

        ) {

            ammoText.textContent =

                `${player.ammo}/${MAX_AMMO}`;

        }


        ammoDots.innerHTML =
            "";


        for (

            let i = 0;

            i < MAX_AMMO;

            i++

        ) {

            const dot =
                document
                    .createElement(
                        "span"
                    );


            dot.className =
                "ammo-dot";


            if (
                i >=
                player.ammo
            ) {

                dot.classList
                    .add(
                        "empty"
                    );

            }


            ammoDots
                .appendChild(
                    dot
                );

        }


        const boss =

            zombies.find(
                z => z.boss
            );


        if (
            boss
        ) {

            bossHud
                .classList
                .remove(
                    "hidden"
                );


            bossBar.style.width =

                `${
                    Math.max(

                        0,

                        boss.hp
                        /
                        boss.maxHp

                    )
                    *
                    100
                }%`;

        }


        else if (

            !state.bossSpawned

            ||

            state.bossDefeated

        ) {

            bossHud
                .classList
                .add(
                    "hidden"
                );

        }

    }


    function updateEffectText(
        now
    ) {

        if (
            now
            <
            state.rapidFireUntil
        ) {

            const seconds =

                Math.ceil(

                    (
                        state.rapidFireUntil
                        -
                        now
                    )

                    /

                    1000

                );


            effectText.textContent =

                `TIRO RÁPIDO ${seconds}s`;

        }


        else {

            effectText.textContent =
                "";

        }

    }


    // =========================================================
    // UTILIDADES
    // =========================================================

    function clampPlayer() {

        const margin =
            player.radius + 8;


        player.x =

            Math.max(

                margin,

                Math.min(

                    gameWidth()
                    -
                    margin,

                    player.x

                )

            );


        player.y =

            Math.max(

                margin,

                Math.min(

                    gameHeight()
                    -
                    margin,

                    player.y

                )

            );

    }


    function circleCollision(
        x1,
        y1,
        r1,
        x2,
        y2,
        r2
    ) {

        const dx =
            x1 - x2;


        const dy =
            y1 - y2;


        const radius =
            r1 + r2;


        return (

            dx * dx
            +
            dy * dy

            <=

            radius * radius

        );

    }


    function nearestZombie() {

        let nearest =
            null;


        let best =
            Infinity;


        for (
            const enemy
            of zombies
        ) {

            const dist =

                (
                    enemy.x
                    -
                    player.x
                ) ** 2

                +

                (
                    enemy.y
                    -
                    player.y
                ) ** 2;


            if (
                dist < best
            ) {

                best =
                    dist;


                nearest =
                    enemy;

            }

        }


        return nearest;

    }


    function pointerPosition(
        event
    ) {

        const rect =
            canvas
                .getBoundingClientRect();


        return {

            x:
                event.clientX
                -
                rect.left,

            y:
                event.clientY
                -
                rect.top

        };

    }


    // =========================================================
    // PAUSA
    // =========================================================

    function togglePause(
        force = null
    ) {

        if (

            !screens.game
                .classList
                .contains(
                    "active"
                )

        ) {

            return;

        }


        if (

            state.phase
            ===
            "intermission"

            ||

            state.phase
            ===
            "ended"

        ) {

            return;

        }


        const shouldPause =

            force === null

                ? state.phase
                    ===
                    "playing"

                : force;


        if (
            shouldPause
        ) {

            state.phase =
                "paused";


            resetJoystick();


            pauseOverlay
                .classList
                .remove(
                    "hidden"
                );

        }


        else {

            state.phase =
                "playing";


            pauseOverlay
                .classList
                .add(
                    "hidden"
                );


            state.lastFrame =
                performance.now();

        }

    }


    // =========================================================
    // LOOP
    // =========================================================

    function gameLoop(
        now
    ) {

        const dt =

            Math.min(

                0.033,

                Math.max(

                    0,

                    (
                        now
                        -
                        state.lastFrame
                    )

                    /

                    1000

                )

            );


        state.lastFrame =
            now;


        refreshOrientationState();


        if (

            screens.game
                .classList
                .contains(
                    "active"
                )

        ) {

            update(
                dt,
                now
            );


            draw();

        }


        requestAnimationFrame(
            gameLoop
        );

    }


    // =========================================================
    // TECLADO
    // =========================================================

    window.addEventListener(
        "keydown",
        event => {

            const key =
                event.key
                    .toLowerCase();


            if (

                [
                    "arrowup",
                    "arrowdown",
                    "arrowleft",
                    "arrowright",
                    " "
                ].includes(
                    key
                )

            ) {

                event.preventDefault();

            }


            if (

                key === "p"

                ||

                key === "escape"

            ) {

                if (
                    !event.repeat
                ) {

                    togglePause();

                }


                return;

            }


            if (
                state.phase
                !==
                "playing"
            ) {

                return;

            }


            if (
                key === "w"
                ||
                key === "arrowup"
            ) {

                keys.up =
                    true;

            }


            if (
                key === "s"
                ||
                key === "arrowdown"
            ) {

                keys.down =
                    true;

            }


            if (
                key === "a"
                ||
                key === "arrowleft"
            ) {

                keys.left =
                    true;

            }


            if (
                key === "d"
                ||
                key === "arrowright"
            ) {

                keys.right =
                    true;

            }


            if (
                key === "r"
            ) {

                reload();

            }


            if (

                key === " "

                &&

                !event.repeat

            ) {

                const target =
                    nearestZombie();


                if (
                    target
                ) {

                    shoot(

                        target.x,

                        target.y

                    );

                }


                else {

                    shoot(

                        player.x
                        +
                        player.direction
                        *
                        100,

                        player.y

                    );

                }

            }

        }

    );


    window.addEventListener(
        "keyup",
        event => {

            const key =
                event.key
                    .toLowerCase();


            if (
                key === "w"
                ||
                key === "arrowup"
            ) {

                keys.up =
                    false;

            }


            if (
                key === "s"
                ||
                key === "arrowdown"
            ) {

                keys.down =
                    false;

            }


            if (
                key === "a"
                ||
                key === "arrowleft"
            ) {

                keys.left =
                    false;

            }


            if (
                key === "d"
                ||
                key === "arrowright"
            ) {

                keys.right =
                    false;

            }

        }

    );


    // =========================================================
    // MOUSE
    // =========================================================

    canvas.addEventListener(
        "pointermove",
        event => {

            if (
                event.pointerType
                ===
                "touch"
            ) {

                return;

            }


            const point =
                pointerPosition(
                    event
                );


            pointer = {

                ...point,

                active:
                    true

            };

        }

    );


    canvas.addEventListener(
        "pointerleave",
        event => {

            if (
                event.pointerType
                !==
                "touch"
            ) {

                pointer.active =
                    false;

            }

        }

    );


    canvas.addEventListener(
        "pointerdown",
        event => {

            if (
                event.pointerType
                ===
                "touch"
            ) {

                const point =
                    pointerPosition(
                        event
                    );


                pointer = {

                    ...point,

                    active:
                        true

                };


                shoot(

                    point.x,

                    point.y

                );


                return;

            }


            if (
                event.button === 0
            ) {

                const point =
                    pointerPosition(
                        event
                    );


                pointer = {

                    ...point,

                    active:
                        true

                };


                shoot(

                    point.x,

                    point.y

                );

            }

        }

    );


    // =========================================================
    // JOYSTICK MOBILE
    // =========================================================

    function updateJoystickFromEvent(
        event
    ) {

        const rect =
            joystickEl
                .getBoundingClientRect();


        const centerX =
            rect.left
            +
            rect.width / 2;


        const centerY =
            rect.top
            +
            rect.height / 2;


        let dx =
            event.clientX
            -
            centerX;


        let dy =
            event.clientY
            -
            centerY;


        const maxRadius =
            rect.width
            *
            0.34;


        const distance =
            Math.hypot(
                dx,
                dy
            );


        if (
            distance
            >
            maxRadius
        ) {

            dx =
                dx
                /
                distance
                *
                maxRadius;


            dy =
                dy
                /
                distance
                *
                maxRadius;

        }


        const nx =
            dx
            /
            maxRadius;


        const ny =
            dy
            /
            maxRadius;


        const deadzone =
            0.12;


        joystick.x =

            Math.abs(nx)
            <
            deadzone

                ? 0

                : nx;


        joystick.y =

            Math.abs(ny)
            <
            deadzone

                ? 0

                : ny;


        joystickKnob.style.transform =

            `translate(
                calc(-50% + ${dx}px),
                calc(-50% + ${dy}px)
            )`;

    }


    function resetJoystick() {

        joystick.x =
            0;

        joystick.y =
            0;

        joystick.active =
            false;

        joystick.pointerId =
            null;


        if (
            joystickKnob
        ) {

            joystickKnob.style.transform =
                "translate(-50%, -50%)";

        }

    }


    joystickEl.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();


            joystick.active =
                true;


            joystick.pointerId =
                event.pointerId;


            try {

                joystickEl
                    .setPointerCapture(
                        event.pointerId
                    );

            }

            catch (_) {}


            updateJoystickFromEvent(
                event
            );

        }

    );


    joystickEl.addEventListener(
        "pointermove",
        event => {

            if (

                !joystick.active

                ||

                event.pointerId
                !==
                joystick.pointerId

            ) {

                return;

            }


            event.preventDefault();


            updateJoystickFromEvent(
                event
            );

        }

    );


    const releaseJoystick =
        event => {

            if (

                joystick.pointerId
                !==
                null

                &&

                event.pointerId
                !==
                joystick.pointerId

            ) {

                return;

            }


            event.preventDefault();


            resetJoystick();

        };


    joystickEl.addEventListener(
        "pointerup",
        releaseJoystick
    );


    joystickEl.addEventListener(
        "pointercancel",
        releaseJoystick
    );


    joystickEl.addEventListener(
        "lostpointercapture",
        releaseJoystick
    );


    // =========================================================
    // FIRE MOBILE
    // =========================================================

    shootBtn.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();


            const target =
                nearestZombie();


            if (
                target
            ) {

                shoot(

                    target.x,

                    target.y

                );

            }


            else {

                shoot(

                    player.x
                    +
                    player.direction
                    *
                    100,

                    player.y

                );

            }

        }

    );


    // =========================================================
    // RELOAD MOBILE
    // =========================================================

    reloadBtn.addEventListener(
        "pointerdown",
        event => {

            event.preventDefault();


            reload();

        }

    );


    // =========================================================
    // BOTÕES DE INTERFACE
    // =========================================================

    playBtn.addEventListener(
        "click",
        () => {

            ensureAudio();


            showScreen(
                "instructions"
            );

        }

    );


    startGameBtn.addEventListener(
        "click",
        () => {

            ensureAudio();


            showScreen(
                "game"
            );


            setTimeout(
                () => {

                    resizeCanvas();


                    resetGame();

                },

                40
            );

        }

    );


    restartBtn.addEventListener(
        "click",
        () => {

            showScreen(
                "game"
            );


            setTimeout(
                () => {

                    resizeCanvas();


                    resetGame();

                },

                40
            );

        }

    );


    // =========================================================
    // CONTINUAR APÓS MORRER
    // =========================================================

    continueLifeBtn.addEventListener(
        "click",
        () => {

            if (
                state.continues <= 0
            ) {

                return;

            }


            state.continues--;


            state.score =
                state.stageStartScore;


            showScreen(
                "game"
            );


            setTimeout(
                () => {

                    resizeCanvas();


                    player.health =
                        MAX_HEALTH;


                    player.ammo =
                        MAX_AMMO;


                    player.reloadUntil =
                        0;


                    player.nextShot =
                        0;


                    state.rapidFireUntil =
                        0;


                    startStage(
                        state.stage
                    );


                    updateHud();

                },

                40
            );

        }

    );


    continueStageBtn.addEventListener(

        "click",

        continueToNextStage

    );


    pauseBtn.addEventListener(
        "click",
        () => {

            togglePause();

        }
    );


    resumeBtn.addEventListener(
        "click",
        () => {

            togglePause(
                false
            );

        }
    );


    pauseRestartBtn.addEventListener(
        "click",
        () => {

            pauseOverlay
                .classList
                .add(
                    "hidden"
                );


            resetGame();

        }
    );


    // =========================================================
    // SOM
    // =========================================================

    soundBtn.addEventListener(
        "click",
        () => {

            state.soundOn =
                !state.soundOn;


            soundBtn
                .classList
                .toggle(

                    "off",

                    !state.soundOn

                );


            soundBtn.textContent =

                state.soundOn

                    ? "SOM"

                    : "MUDO";


            if (
                state.soundOn
            ) {

                ensureAudio();


                tone(

                    440,

                    0.06,

                    "sine",

                    0.025,

                    600

                );

            }

        }

    );


    // =========================================================
    // REDIMENSIONAMENTO
    // =========================================================

    window.addEventListener(
        "resize",
        () => {

            resizeCanvas();


            mobilePointer =

                window
                    .matchMedia(
                        "(pointer: coarse)"
                    )
                    .matches;


            refreshOrientationState();

        }

    );


    window.addEventListener(
        "orientationchange",
        () => {

            setTimeout(
                () => {

                    resizeCanvas();


                    refreshOrientationState();

                },

                120
            );

        }

    );


    // =========================================================
    // TROCA DE ABA
    // =========================================================

    document.addEventListener(
        "visibilitychange",
        () => {

            if (

                document.hidden

                &&

                state.phase
                ===
                "playing"

            ) {

                togglePause(
                    true
                );

            }


            keys.up =
                false;

            keys.down =
                false;

            keys.left =
                false;

            keys.right =
                false;


            resetJoystick();


            state.lastFrame =
                performance.now();

        }

    );


    // =========================================================
    // INICIALIZAÇÃO
    // =========================================================

    startHighScore.textContent =
        state.highScore;


    highScoreText.textContent =
        state.highScore;


    finalHighScoreText.textContent =
        state.highScore;


    updateHud();


    refreshOrientationState();


    requestAnimationFrame(
        gameLoop
    );


})();