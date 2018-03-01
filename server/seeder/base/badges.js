// eslint-disable-next-line no-unused-vars
module.exports = (seederstore, app) => {
  const badges = [
    { 
      type: 'role',
      status: 'temporary',
      key: 'user_role_admin'
    },
    { 
      type: 'role',
      status: 'temporary',
      key: 'user_role_moderator'
    },
    { 
      type: 'role',
      status: 'temporary',
      key: 'user_role_developer'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'indiegogo_en_racoon'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'indiegogo_en_rabbit'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'indiegogo_en_wolf'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'indiegogo_en_bear'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'indiegogo_en_turtle'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'indiegogo_en_rhino'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'indiegogo_en_tiger'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'indiegogo_en_panda'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'indiegogo_en_whale'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'fundraisingbox_de_starter'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'fundraisingbox_de_crane'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'fundraisingbox_de_balloon'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'fundraisingbox_de_glider'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'fundraisingbox_de_helicopter'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'fundraisingbox_de_bigballoon'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'fundraisingbox_de_airship'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'fundraisingbox_de_alienship'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'wooold_de_bee'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'wooold_de_butterfly'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'wooold_de_flower'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'wooold_de_lifetree'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'wooold_de_double_rainbow'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'wooold_de_magic_rainbow'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'wooold_de_end_of_rainbow'
    },
    { 
      type: 'crowdfunding',
      status: 'permanent',
      key: 'wooold_de_super_founder'
    }
  ];

  let services = [];
  badges.forEach((badge) => {
    services.push({
      path: 'badges',
      template: {
        image: {
          path: `${app.get('baseURL')}/img/badges/${badge.key}.svg`,
          alt: badge.key
        },
        status: badge.status,
        key: badge.key,
        type: badge.type
      }
    });
  });

  return {
    services: services
  };
};
