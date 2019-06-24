export default [
  {
    _id: 1,
    text: 'Bonjour, je suis le bot Watson. Lequel de vos véhicules est impliqué ?',
    createdAt: new Date(),
    quickReplies: {
      type: 'radio', // or 'checkbox',
      keepIt: true,
      values: [
        {
          title: 'Ma Clio 3',
          value: 'vehicule_1',
        },
        {
          title: 'Mon 5008',
          value: 'vehicule_2',
        },
      ],
    },
    user: {
      _id: 'watson_id',
      name: 'Watson',
    },
  },
  {
    _id: 2,
    text: 'Contrôle desgaranties du véhicule 1',
    createdAt: new Date(),
    system: true,
  },
  {
    _id: 3,
    text: 'Voilà le récapitulatif des garanties du véhicule concerné :',
    createdAt: new Date(),
    user: {
      _id: 'watson_id',
      name: 'Watson',
    },
  },
  {
    _id: 4,
    text: 'Confirmez-vous la géolocalisation du véhicule concerné ?',
    createdAt: new Date(),
    quickReplies: {
      type: 'radio', // or 'checkbox',
      keepIt: true,
      values: [
        {
          title: 'Yes',
          value: 'yes',
        },
        {
          title: 'No',
          value: 'no',
        },
      ],
    },
    user: {
      _id: 'watson_id',
      name: 'Watson',
    },
  },
]
