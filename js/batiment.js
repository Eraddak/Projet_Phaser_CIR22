let batiment = function(valeur_bois, valeur_pierre, valeur_energie, valeur_popul, url_img, produc_bois, produc_pierre, produc_nourriture,
                        produc_energie, valeur_eco, ajout_popul) {

  return {
      cout_bois : valeur_bois,
      cout_pierre : valeur_pierre,
      cout_energie : valeur_energie,
      cout_population : valeur_popul,
      income_bois : produc_bois,
      income_pierre : produc_pierre,
      income_nourriture : produc_nourriture,
      income_energie : produc_energie,
      add_population : ajout_popul,
      impact_eco : valeur_eco,
      texte_infobulle : "",
      isActive : true,
      url_image : "" + url_img,

};

};

