export const SideBar = {
    items: [
        {
            index: 1,
            name: 'Home',
            icon: 'home', iconType: 'regular', route: '/', id: 'home',
            children: []
        },
        {
            index: 1, name: 'Restaurants', icon: 'home', iconType: 'regular', route: '/all-restaurants', id: 'home',
            children: [
                {
                    index: 1,
                    name: 'All Restaurants',
                    icon: 'home',
                    iconType: 'regular',
                    route: '/all-restaurants',
                    id: 'home',
                },
                {
                    index: 1,
                    name: 'Favorite Restaurants',
                    icon: 'home',
                    iconType: 'regular',
                    route: '/favorite-restaurants',
                    id: 'favorite',

                }
            ]
        },
        {
            index: 2,
            name: 'Create Restaurant',
            icon: 'store',
            iconType: 'regular',
            route: '/create-restaurant',
            id: 'restaurant',
            children: []
        },
        {
            index: 2,
            name: 'Contact Us',
            icon: 'contact_page',
            iconType: 'regular',
            route: '/create-restaurant',
            id: 'contact',
            children: []
        }

    ],
    sideBarGroups: [{
        title: 'User',
        open: true,
        icon: 'user-circle',
        items: [
            {index: 1, name: 'Profile', icon: 'user-detail', iconType: 'solid', route: `/user-profile`, id: 'profile'},
            {index: 2, name: 'Credentials', icon: 'lock-alt', iconType: 'solid', route: `/user-profile`, id: 'profile'}
        ],
    }]
};
