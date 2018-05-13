(function () {

    const game = new Phaser.Game(1024, 576, Phaser.AUTO, '', {preload: preload, create: create, update: update});

    function preload() {
        game.load.spritesheet("bouton", "assets/images/bouton.png", 186, 203);
        game.load.spritesheet("nuke_factory", "assets/images/Nuke_factory_sprite.png", 128, 128, 3);
        game.load.spritesheet("bouton_nukeFactory", "assets/images/bouton_nukeFactory.png", 186, 203);
        game.load.spritesheet("bouton_eolienne", "assets/images/bouton_eolienne.png", 186, 203);
        game.load.spritesheet("bouton_panneauxSol", "assets/images/bouton_panneaux_sol.png", 186, 203);
        game.load.image("ressource_energie", "assets/images/eclair.png");
        game.load.image("ressource_nourriture", "assets/images/Nourriture.png");
        game.load.image("ressource_pierre", "assets/images/pierre.png");
        game.load.image("ressource_population", "assets/images/population.png");
        game.load.image("ressource_bois", "assets/images/Tas de buche.png");
        game.load.image("interface-milieu", "assets/images/HUD-milieu.png");
        game.load.image("interface-droite", "assets/images/HUD-droite.png");
        game.load.image("interface-haut", "assets/images/HUD-haut.png");
        //game.load.image("map", "assets/images/carte.png");
        game.load.tilemap('map', 'assets/tiled/carte.json', null, Phaser.Tilemap.TILED_JSON);
        //game.load.image('cadrillage_map', 'assets/tiled/cadrillage.png');
        game.load.image('map_img', 'assets/tiled/carte.png');
        //game.load.image('map_pixels', 'assets/tiled/Map_pixel.png');
    }

    let ressources = {
        bois : {
            valeur_dispo : 100,
            valeur_max : 0
        },
        nourriture : {
            valeur_dispo: 100,
            valeur_max: 0
        },
        energie : {
            valeur_dispo : 100,
            valeur_max : 0
        },
        pierre : {
            valeur_dispo : 100,
            valeur_max : 0
        },
        population : {
            valeur_dispo : 20,
            valeur_totale : 20
        },
        pollution : 0
    };

    let marker;
    let map;
    let layer;

    let HUD_droite;
    let HUD_milieu;
    let HUD_haut;
    let HUD_energie;
    let HUD_nourriture;
    let HUD_ressources;
    let HUD_social;
    let HUD_grp;

    let interface_energie = false;
    let interface_ressources = false;
    let interface_nourriture = false;
    let interface_social = false;

    let bouton_fullscreen;
    let bouton_energie;
    let bouton_nourriture;
    let bouton_ressources;
    let bouton_social;

    let texte_bouton_energie;
    let texte_bouton_nourriture;
    let texte_bouton_ressources;
    let texte_bouton_social;
    let texte_bouton_fullscreen;

    let bouton_nuke_factory;
    let bouton_eolienne;
    let bouton_panneauxSol;

    let img_bois;
    let img_nourriture;
    let img_energie;
    let img_pierre;
    let img_population;

    let texte_ressource_bois;
    let texte_ressource_nourriture;
    let texte_ressource_energie;
    let texte_ressource_pierre;
    let texte_ressource_population;

    let total_income_bois = 0;
    let total_income_pierre = 0;
    let total_income_nourriture = 0;
    let total_income_pollution = -10;

    let liste_batiments = {

        nb_Mairie : 0,
        nb_Eolienne : 0,
        nb_CentraleNuke : 0,
        nb_PanneauxSol : 0,
        nb_FermesHydrop : 0,
        nb_Port : 0,
        nb_Scierie : 0,
        nb_Entrepot : 0,
        nb_HLM : 0,
        nb_MaisonEco :0

    };

    let nuke_factory_b = new Object(batiment(100, 500, 100, 50, "nuke_factory", 1, 1, 1, 100, 10, 5));
    //let mairie_b = new Object(batiment());

    function create() {

        map = game.add.tilemap('map');
        map.addTilesetImage("ancienne map", "map_img");
        layer = map.createLayer("background");
        layer.resizeWorld();
        marker = game.add.graphics();
        marker.lineStyle(5, 0xffffff, 1);
        marker.drawRect(0, 0, 128, 128);

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

        HUD_energie = game.add.sprite(0, 576, "interface-milieu");
        HUD_energie.anchor.setTo(0, 0.495);
        HUD_nourriture = game.add.sprite(0, 576, "interface-milieu");
        HUD_nourriture.anchor.setTo(0, 0.495);
        HUD_ressources = game.add.sprite(0, 576, "interface-milieu");
        HUD_ressources.anchor.setTo(0, 0.495);
        HUD_social = game.add.sprite(0, 576, "interface-milieu");
        HUD_social.anchor.setTo(0, 0.495);
        HUD_milieu = game.add.sprite(0, 576, "interface-milieu");
        HUD_milieu.anchor.setTo(0, 0.495);
        HUD_droite = game.add.sprite(0, 319, "interface-droite");
        HUD_haut = game.add.sprite(0, 0, "interface-haut");

        bouton_energie = game.add.button(20, 530, "bouton", glisser_interface_energie,this, 0, 0, 1);
        bouton_energie.scale.setTo(0.8, 0.2);
        texte_bouton_energie = game.add.text(55, 535, "Energie", {font:"20px Arial"});

        bouton_nourriture = game.add.button(210, 530, "bouton", glisser_interface_nourriture,this, 0, 0, 1);
        bouton_nourriture.scale.setTo(0.8, 0.2);
        texte_bouton_nourriture = game.add.text(235, 535, "Nourriture", {font:"20px Arial"});

        bouton_ressources = game.add.button(400, 530, "bouton", glisser_interface_ressources,this, 0, 0, 1);
        bouton_ressources.scale.setTo(0.8, 0.2);
        texte_bouton_ressources = game.add.text(425, 535, "Ressources", {font:"20px Arial"});

        bouton_social = game.add.button(590, 530, "bouton", glisser_interface_social,this, 0, 0, 1);
        bouton_social.scale.setTo(0.8, 0.2);
        texte_bouton_social = game.add.text(635, 535, "Social", {font:"20px Arial"});

        img_bois = game.add.sprite(10, 0, "ressource_bois");
        img_bois.scale.setTo(0.065, 0.065);
        img_nourriture = game.add.sprite(130, 2, "ressource_nourriture");
        img_nourriture.scale.setTo(0.45, 0.45);
        img_pierre = game.add.sprite(257, 0, "ressource_pierre");
        img_pierre.scale.setTo(0.08, 0.08);
        img_energie = game.add.sprite(385, 0, "ressource_energie");
        img_energie.scale.setTo(0.015, 0.015);
        img_population = game.add.sprite(515, 0, "ressource_population");
        img_population.scale.setTo(0.043, 0.043);

        texte_ressource_bois = game.add.text(30, 0, ressources.bois.valeur_dispo + "/" + ressources.bois.valeur_max + "\t (+" + total_income_bois + ")", {font:"15px Arial"} );
        texte_ressource_nourriture = game.add.text(160, 0, ressources.nourriture.valeur_dispo + "/" + ressources.nourriture.valeur_max + "\t (+" + total_income_nourriture + ")", {font:"15px Arial"});
        texte_ressource_energie = game.add.text(400, 0, ressources.energie.valeur_dispo + "/" + ressources.energie.valeur_max, {font:"15px Arial"});
        texte_ressource_pierre = game.add.text(280, 0, ressources.pierre.valeur_dispo + "/" + ressources.pierre.valeur_max + "\t (+" + total_income_pierre + ")", {font:"15px Arial"});
        texte_ressource_population = game.add.text(540, 0, ressources.population, {font:"15px Arial"});

        bouton_fullscreen = game.add.button(930, 2, "bouton", fullScreen, this, 0, 0, 1);
        bouton_fullscreen.scale.setTo(0.5, 0.07);
        texte_bouton_fullscreen = game.add.text(950, 2, "Fullscreen", {font:"10px Arial"});

        HUD_grp = game.add.group();
        HUD_grp.add(HUD_energie);
        HUD_grp.add(HUD_nourriture);
        HUD_grp.add(HUD_ressources);
        HUD_grp.add(HUD_social);
        HUD_grp.add(HUD_milieu);
        HUD_grp.add(HUD_droite);
        HUD_grp.add(HUD_haut);
        HUD_grp.add(bouton_energie);
        HUD_grp.add(texte_bouton_energie);
        HUD_grp.add(bouton_nourriture);
        HUD_grp.add(texte_bouton_nourriture);
        HUD_grp.add(bouton_ressources);
        HUD_grp.add(texte_bouton_ressources);
        HUD_grp.add(bouton_social);
        HUD_grp.add(texte_bouton_social);
        HUD_grp.add(bouton_fullscreen);
        HUD_grp.add(texte_bouton_fullscreen);
        HUD_grp.add(img_bois);
        HUD_grp.add(img_nourriture);
        HUD_grp.add(img_pierre);
        HUD_grp.add(img_energie);
        HUD_grp.add(img_population);
        HUD_grp.add(texte_ressource_bois);
        HUD_grp.add(texte_ressource_nourriture);
        HUD_grp.add(texte_ressource_pierre);
        HUD_grp.add(texte_ressource_energie);
        HUD_grp.add(texte_ressource_population);
        HUD_grp.fixedToCamera = true;

        game.time.events.loop(Phaser.Timer.SECOND * 5, actualiser_ressources, this);

        bouton_nuke_factory = game.add.button(20, -20, "bouton_nukeFactory", action_bouton_nuke_factory, this, 0, 0, 1);
        HUD_energie.addChild(bouton_nuke_factory);
        bouton_nuke_factory.scale.setTo(0.5, 0.5);

        bouton_eolienne = game.add.button(150, -20, "bouton_eolienne", null, this, 0, 0, 1);
        HUD_energie.addChild(bouton_eolienne);
        bouton_eolienne.scale.setTo(0.5, 0.5);

        bouton_panneauxSol = game.add.button(280, -20, "bouton_panneauxSol", null, this, 0, 0, 1);
        HUD_energie.addChild(bouton_panneauxSol);
        bouton_panneauxSol.scale.setTo(0.5, 0.5);

        game.input.addMoveCallback(updateMarker, this);

    }

    function updateMarker() {

        marker.x = layer.getTileX(game.input.activePointer.worldX) * 128;
        marker.y = layer.getTileY(game.input.activePointer.worldY) * 128;

    }

    function update() {

        total_income_nourriture = -ressources.population.valeur_totale / 10;

        game.world.bringToTop(HUD_grp);

        if(game.input.activePointer.x >= 1022){
            game.camera.x += 10;
        }
        if(game.input.activePointer.x <= 2){
            game.camera.x -= 10;
        }
        if(game.input.activePointer.y >= 574){
            game.camera.y += 10;
        }
        if(game.input.activePointer.y <= 2){
            game.camera.y -= 10;
        }

        gerer_HUD();
        actualiser_texte_ressources();

    }

    function glisser_interface_energie() {

        interface_energie = !interface_energie;
        interface_nourriture = false;
        interface_ressources = false;
        interface_social = false;
    }

    function glisser_interface_nourriture() {

        interface_energie = false;
        interface_nourriture = !interface_nourriture;
        interface_ressources = false;
        interface_social = false;
    }

    function glisser_interface_ressources() {

        interface_energie = false;
        interface_nourriture = false;
        interface_ressources = !interface_ressources;
        interface_social = false;
    }

    function glisser_interface_social() {

        interface_energie = false;
        interface_nourriture = false;
        interface_ressources = false;
        interface_social = !interface_social;
    }

    function gerer_HUD() {

        if(interface_energie && HUD_energie.y > 400){
            HUD_energie.y -= 10;
        }
        else if(!interface_energie && HUD_energie.y < 576){
            HUD_energie.y += 10;
        }

        if(interface_nourriture && HUD_nourriture.y > 400){
            HUD_nourriture.y -= 10;
        }
        else if(!interface_nourriture&& HUD_nourriture.y < 576){
            HUD_nourriture.y += 10;
        }

        if(interface_ressources && HUD_ressources.y > 400){
            HUD_ressources.y -= 10;
        }
        else if(!interface_ressources && HUD_ressources.y < 576){
            HUD_ressources.y += 10;
        }

        if(interface_social && HUD_social.y > 400){
            HUD_social.y -= 10;
        }
        else if(!interface_social && HUD_social.y < 576){
            HUD_social.y += 10;
        }
    }

    function action_bouton_nuke_factory() {
//à revoir

        if(ressources.bois.valeur_dispo < nuke_factory_b.cout_bois
        || ressources.pierre.valeur_dispo < nuke_factory_b.cout_pierre
        || ressources.population.valeur_dispo < nuke_factory_b.cout_population
        || ressources.energie.valeur_dispo < nuke_factory_b.cout_energie) return;

        let nuke_factory_sprite = game.add.sprite(4300, 3800, "nuke_factory");
        nuke_factory_sprite.inputEnabled = true;
        nuke_factory_sprite.events.onInputDown.add(actualise_ressources_b(nuke_factory_b), this);

        liste_batiments.nb_CentraleNuke ++;

        // à mettre en fonction pour généraliser
        total_income_bois += nuke_factory_b.income_bois;
        total_income_nourriture += nuke_factory_b.income_nourriture;
        total_income_pierre += nuke_factory_b.income_pierre;
        total_income_pollution += nuke_factory_b.impact_eco;
        ressources.energie.valeur_dispo += nuke_factory_b.income_energie;

        ressources.population.valeur_dispo -= nuke_factory_b.cout_population;
        ressources.bois.valeur_dispo -= nuke_factory_b.cout_bois;
        ressources.pierre.valeur_dispo -= nuke_factory_b.cout_pierre;

    }

    function fullScreen() {

        if (game.scale.isFullScreen)
        {
            game.scale.stopFullScreen();
        }
        else
        {
            game.scale.startFullScreen(false);
        }
    }

    let actualiser_ressources = function () {

        if(ressources.nourriture.valeur_dispo < 0) ressources.nourriture.valeur_dispo = 0;
        if(ressources.bois.valeur_dispo < 0) ressources.bois.valeur_dispo = 0;
        if(ressources.pierre.valeur_dispo < 0) ressources.pierre.valeur_dispo = 0;
        if(ressources.energie.valeur_dispo < 0) ressources.energie.valeur_dispo = 0;
        if(ressources.population.valeur_dispo < 0) ressources.population.valeur_dispo = 0;

        ressources.nourriture.valeur_dispo += total_income_nourriture;
        ressources.bois.valeur_dispo += total_income_bois;
        ressources.pierre.valeur_dispo += total_income_pierre;
        if(ressources.pollution >= Math.abs(total_income_pollution)){
            ressources.pollution += total_income_pollution;
        }
        else ressources.pollution = 0;
    };

    let actualiser_texte_ressources = function () {

        texte_ressource_bois.setText(ressources.bois.valeur_dispo + "/" + ressources.bois.valeur_max + "\t (+" + total_income_bois + ")");
        texte_ressource_pierre.setText(ressources.pierre.valeur_dispo + "/" + ressources.pierre.valeur_max + "\t (+" + total_income_pierre + ")");
        texte_ressource_nourriture.setText(ressources.nourriture.valeur_dispo + "/" + ressources.nourriture.valeur_max + "\t (+" + total_income_nourriture + ")");
        texte_ressource_energie.setText(ressources.energie.valeur_dispo + "/" + ressources.energie.valeur_max);
        texte_ressource_population.setText(ressources.population.valeur_dispo + "/" + ressources.population.valeur_totale);
    };

    let actualise_ressources_b = function (batiment) {

        if(!batiment.isActive){
            total_income_bois -= batiment.income_bois;
            total_income_nourriture -= batiment.income_nourriture;
            total_income_pierre -= batiment.income_pierre;
            total_income_pollution -= batiment.impact_eco;
            ressources.energie.valeur_dispo -= batiment.income_energie;
        }
        else {
            total_income_bois += batiment.income_bois;
            total_income_nourriture += batiment.income_nourriture;
            total_income_pierre += batiment.income_pierre;
            total_income_pollution += batiment.impact_eco;
            ressources.energie.valeur_dispo += batiment.income_energie;
        }
    }

})();