export const SideBar = {
    items: [
        {index: 1, name: 'Home', icon: 'home', iconType: 'regular', route: '/', id: 'home'},
        {index: 2, name: 'Create Restaurant', icon: 'store', iconType: 'regular', route: '/add-restaurant', id:'restaurant'}
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
