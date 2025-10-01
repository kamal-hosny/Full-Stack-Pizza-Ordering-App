type Field = {
  label: string;
  placeholder: string;
  validation?: {
    required: string;
    invalid?: string;
  };
};

export type Translations = {
  logo: string;
  home: {
    hero: {
      title: string;
      description: string;
      orderNow: string;
      learnMore: string;
    };
    bestSeller: {
      checkOut: string;
      OurBestSellers: string;
    };
    about: {
      ourStory: string;
      aboutUs: string;
      descriptions: {
        one: string;
        two: string;
        three: string;
      };
    };
    contact: {
      "Don'tHesitate": string;
      contactUs: string;
    };
  };
  navbar: {
    home: string;
    about: string;
    menu: string;
    contact: string;
    login: string;
    register: string;
    signOut: string;
    profile: string;
    admin: string;
  };
  auth: {
    login: {
      title: string;
      name: Field;
      email: Field;
      password: Field;
      submit: string;
      authPrompt: {
        message: string;
        signUpLinkText: string;
      };
    };
    register: {
      title: string;
      name: Field;
      email: Field;
      password: Field;
      confirmPassword: Field;
      submit: string;
      authPrompt: {
        message: string;
        loginLinkText: string;
      };
    };
  };
  validation: {
    nameRequired: string;
    validEmail: string;
    passwordMinLength: string;
    passwordMaxLength: string;
    confirmPasswordRequired: string;
    passwordMismatch: string;
  };
  menuItem: {
    addToCart: string;
  };
  messages: {
    userNotFound: string;
    incorrectPassword: string;
    loginSuccessful: string;
    unexpectedError: string;
    userAlreadyExists: string;
    accountCreated: string;
    updateProfileSucess: string;
    categoryAdded: string;
    updatecategorySucess: string;
    deleteCategorySucess: string;
    productAdded: string;
    updateProductSucess: string;
    deleteProductSucess: string;
    updateUserSucess: string;
    deleteUserSucess: string;
  };
  cart: {
    title: string;
    noItemsInCart: string;
  };
  profile: {
    title: string;
    form: {
      name: Field;
      email: Field;
      phone: Field;
      address: Field;
      postalCode: Field;
      city: Field;
      country: Field;
    };
    role: {
      changeRole: string;
      superAdmin: string;
      admin: string;
      user: string;
      promoteToAdmin: string;
    };
    permissions: {
      cannotEdit: string;
      canEditOwn: string;
    };
  };
  admin: {
    tabs: {
      profile: string;
      categories: string;
      menuItems: string;
      users: string;
      orders: string;
    };
    dashboard: {
      welcome: string;
      overviewToday: string;
      lastUpdate: string;
      stats: {
        totalOrders: string;
        pendingOrders: string;
        totalRevenue: string;
        products: string;
        categories: string;
        users: string;
        changeSinceLastMonth: string; // e.g. "{change} from last month"
      };
      statusLabels: {
        PENDING: string;
        CONFIRMED: string;
        PREPARING: string;
        READY: string;
        DELIVERED: string;
        CANCELLED: string;
      };
      recentOrdersTitle: string;
      viewAll: string;
      noRecentOrders: string;
      orderNumberPrefix: string; // e.g. "Order #"
      quickActionsTitle: string;
      quickActions: {
        addProduct: string;
        addProductDesc: string;
        manageOrders: string;
        manageOrdersDesc: string;
        manageCategories: string;
        manageCategoriesDesc: string;
        manageUsers: string;
        manageUsersDesc: string;
      };
      profileTitle: string;
      profileRoleAdmin: string;
    };
    categories: {
      form: {
        editName: string;
        name: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
          };
        };
      };
    };
    users: {
      page: {
        title: string;
        subtitle: string;
        cta: {
          createSuperAdmin: string;
          createDefaultSuperAdmin: string;
        };
        stats: {
          total: string;
          superAdmins: string;
          admins: string;
          regular: string;
        };
        empty: {
          title: string;
          description: string;
        };
        security: {
          title: string;
          description: string;
        };
      };
      list: {
        sections: {
          superAdmins: string;
          admins: string;
          regular: string;
        };
        joinedAt: string;
        noResults: {
          title: string;
          description: string;
        };
      };
      filter: {
        title: string;
        searchPlaceholder: string;
        clear: string;
        role: string;
        all: string;
        admins: string;
        users: string;
        sortBy: string;
        sort: {
          name: string;
          email: string;
          createdAt: string;
          asc: string;
          desc: string;
        };
      };
    };
    "menu-items": {
      page: {
        title: string;
        subtitle: string;
        totalProducts: string;
      };
      addItemSize: string;
      createNewMenuItem: string;
      addExtraItem: string;
      menuOption: {
        name: string;
        extraPrice: string;
      };
      form: {
        name: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
          };
        };
        description: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
          };
        };
        basePrice: {
          label: string;
          placeholder: string;
          validation: {
            required: string;
          };
        };
        category: {
          validation: {
            required: string;
          };
        };
        image: {
          validation: {
            required: string;
          };
        };
      };
    };
  };
  sizes: string;
  extrasIngredients: string;
  delete: string;
  cancel: string;
  create: string;
  save: string;
  category: string;
  copyRight: string;
  noProductsFound: string;
};
