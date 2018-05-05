import React, {Component} from "react";
import HistoryStore, {ROUTE_TYPE} from "../../stores/History/History";
import Users from "../Users/Users";
import "./Dashboard.less"
import Scenes from "../Scenes/Scenes";

const SIDEBAR_MENU = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'fa-home',
        onClick: () => window.application.History.toRoute(ROUTE_TYPE.ON_HOME),
        active: () => HistoryStore.getCurrentRoute() === ROUTE_TYPE.ON_HOME
    },
    {
        id: 'scenes',
        label: 'Scenes',
        icon: 'fa-puzzle-piece',
        onClick: () => window.application.History.toRoute(ROUTE_TYPE.ON_SCENES),
        active: () => HistoryStore.getCurrentRoute().startsWith(ROUTE_TYPE.ON_SCENES)
    },
    {
        id: 'users',
        label: 'Users',
        icon: 'fa-users',
        onClick: () => window.application.History.toRoute(ROUTE_TYPE.ON_USERS),
        active: () => HistoryStore.getCurrentRoute().startsWith(ROUTE_TYPE.ON_USERS)
    },
    // {
    //     id: 'test',
    //     label: 'Test',
    //     icon: 'fa-table',
    //     active: (i) => HistoryStore.getCurrentRoute().startsWith(ROUTE_TYPE.ON_TEST) && !i.isOpen,
    //     open: () => HistoryStore.getCurrentRoute().startsWith(ROUTE_TYPE.ON_TEST),
    //     children: [
    //         {
    //             id: 'test-1',
    //             label: 'Test 1',
    //             icon: 'fa-puzzle-piece',
    //             onClick: () => {
    //                 window.application.History.toRoute(ROUTE_TYPE.ON_TEST_1);
    //             },
    //             active: () => HistoryStore.getCurrentRoute().startsWith(ROUTE_TYPE.ON_TEST_1)
    //         },
    //         {
    //             id: 'test-2',
    //             label: 'Test 2',
    //             icon: 'fa-puzzle-piece',
    //             onClick: () => {
    //                 window.application.History.toRoute(ROUTE_TYPE.ON_TEST_2);
    //             },
    //             active: () => HistoryStore.getCurrentRoute().startsWith(ROUTE_TYPE.ON_TEST_2),
    //             badge: 'new',
    //         }
    //     ]
    // }
];

export class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthorized: window.application.token !== null,
            isMinimized: false
        };
    }

    _update = () => {
        if ((window.application.token !== null) !== this.state.isAuthorized) {
            this.setState({
                isAuthorized: window.application.token !== null
            });
        }
    };

    componentDidMount() {
        window.application.addEventListener('update', this._update);
    }

    componentWillUnmount() {
        window.application.addEventListener('update', this._update);
    }

    onToggleMinimize = () => {
        this.setState({
            isMinimized: !this.state.isMinimized
        });
    };

    render() {
        const {isAuthorized, isMinimized} = this.state;
        const route = HistoryStore.getCurrentRoute();

        if (!isAuthorized) return <AnonymousDashboard/>;

        let container, breadcrumb;
        switch (route) {
            case '/scenes':
                container = <Scenes/>;
                breadcrumb = (
                    <a className="active" href={`#${ROUTE_TYPE.ON_SCENES}`} title="scenes">
                        <i className="fa fa-puzzle-piece"/><span>Scenes</span>
                    </a>
                );
                break;

            case '/users':
                container = <Users/>;
                breadcrumb = (
                    <a className="active" href={`#${ROUTE_TYPE.ON_USERS}`} title="users">
                        <i className="fa fa-users"/><span>Users</span>
                    </a>
                );
                break;

            default:
                container = null; // <div>{route}</div>
                breadcrumb = null;
        }

        return (
            <div className={`dashboard-container${isMinimized ? ' minimized' : ''}`}>
                <DashboardHeader/>
                <DashboardMenu onToggleMinimize={this.onToggleMinimize}/>
                <DashboardMainContainer breadcrumb={breadcrumb}>
                    {container}
                </DashboardMainContainer>
            </div>
        )
    }
}

class DashboardHeader extends Component {
    onLogout = () => {
        window.application.token = null;
    };

    onFullScreen = () => {
        if (window.document.body.classList.contains('fullscreen')) {
            let exitFullScreen = () =>
                window.document.exitFullscreen ? window.document.exitFullscreen() :
                    window.document.webkitExitFullscreen ? window.document.webkitExitFullscreen() :
                        window.document.mozCancelFullScreen ? window.document.mozCancelFullScreen() :
                            window.document.msExitFullscreen ? window.document.msExitFullscreen() : null;

            exitFullScreen();
            window.document.body.classList.remove('fullscreen');
        } else {
            let requestFullScreen = () =>
                window.document.body.requestFullscreen ? window.document.body.requestFullscreen() :
                    window.document.body.webkitRequestFullscreen ? window.document.body.webkitRequestFullscreen() :
                        window.document.body.mozRequestFullScreen ? window.document.body.mozRequestFullScreen() :
                            window.document.body.msRequestFullscreen ? window.document.body.msRequestFullscreen() : null;

            requestFullScreen();
            window.document.body.classList.add('fullscreen');
        }
    };

    render() {
        return (
            <header className="dashboard-header">
                <div className="logo-container">
                    <div className="logo" onClick={() => window.application.History.toRoute(ROUTE_TYPE.ON_HOME)}>
                        Telegraph
                    </div>
                </div>
                <div className="right-container">
                    <div className="button-header">
                        <span>
                            <a href={"javascript:void(0);"} title="sign out" onClick={this.onLogout}>
                                <i className="fa fa-sign-out-alt"/>
                            </a>
                        </span>
                    </div>
                    <div className="button-header">
                        <span>
                            <a href={"javascript:void(0);"} title="fullscreen" onClick={this.onFullScreen}>
                                <i className="fa fa-expand-arrows-alt"/>
                            </a>
                        </span>
                    </div>
                </div>
            </header>
        );
    }
}

class DashboardMenu extends Component {
    render() {
        let userInfo = (
            <span>
                <a href="javascript:void(0);">
                    <img src="" alt="me"/>
                    <span>
                        john.doe
                    </span>
                </a>
            </span>
        );

        userInfo = null;

        return (
            <aside className="dashboard-menu">
                <div className="user-info">
                    {userInfo}
                </div>
                <nav>
                    <ul>
                        {SIDEBAR_MENU.map((item, i) => <DashboardMenuItem item={item} key={`${item.id}-${i}`}/>)}
                    </ul>
                </nav>
                <span className="minimize-menu" onClick={this.props.onToggleMinimize}>
				    <i className="fa fa-arrow-circle-left hit"/>
			    </span>
            </aside>
        )
    }
}

class DashboardMenuItem extends Component {
    constructor(props) {
        super(props);

        let item = Object.assign({}, props.item);
        item.isOpen = (props.item.open !== undefined) ? props.item.open(item) : false;

        this.state = {
            isActive: (props.item.active !== undefined) ? props.item.active(item) : false,
            isOpen: item.isOpen
        };
    }

    componentWillReceiveProps(props) {
        let item = Object.assign({}, props.item);
        item.isOpen = (props.item.open !== undefined) ? props.item.open(item) : false;

        this.setState({
            isActive: props.item !== undefined ? props.item.active(item) : this.state.isActive,
            isOpen: item.isOpen
        });
    }

    toggleMenu = () => {
        const state = !this.state.isOpen;
        let item = Object.assign({}, this.props.item);
        item.isOpen = state;

        this.setState({
            isOpen: state,
            isActive: this.props.item.active(item),
        });
    };

    render() {
        const {item} = this.props;
        const {isActive, isOpen} = this.state;

        return (item.visible !== false) ? (
            <li className={`menu-item${isActive ? ' active' : ''}${isOpen ? ' open' : ''}`}>
                <div className="menu-item-content" onClick={() => {
                    if (item.onClick && !isActive && typeof item.onClick === 'function') {
                        item.onClick(item);
                    } else if (item.children && item.children.length > 0) {
                        this.toggleMenu();
                    }
                }}>
                    <i className={`fa fa-lg fa-fw ${item.icon}`}/>
                    <span className="menu-item-parent">{item.label}</span>

                    {(item.badge !== undefined && (
                        (typeof item.badge === 'number' && item.badge > 0)
                        || (typeof item.badge === 'string' && item.badge.trim() !== '')
                    )) ? (
                        <span className="badge">{item.badge}</span>
                    ) : null}

                    {item.children && item.children.length > 0 ? (
                        <div className="collapse-sign">
                            <i className={`far ${isOpen ? 'fa-minus-square' : 'fa-plus-square'}`}/>
                        </div>
                    ) : null}
                </div>
                {item.children && item.children.length > 0 ? (
                    <ul>
                        {item.children.map((child, i) => <DashboardMenuItem item={child} key={`${child.id}-${i}`}/>)}
                    </ul>
                ) : null}
            </li>
        ) : null
    }
}

class DashboardBreadCrumbPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            breadcrumb: props.breadcrumb
        };
    }

    componentWillReceiveProps(props) {
        if (this.state.breadcrumb !== props.breadcrumb) {
            this.setState({
                breadcrumb: props.breadcrumb
            });
        }
    }

    render() {
        return (
            <div className="ribbon">
                <ol className="breadcrumb">
                    <li><a className={(HistoryStore.getCurrentRoute() === ROUTE_TYPE.ON_HOME) ? 'active' : ''}
                           href={`#${ROUTE_TYPE.ON_HOME}`}
                    >
                        <i className="fa fa-home"/><span>Home</span>
                    </a></li>
                    {this.state.breadcrumb ? <li>{this.state.breadcrumb}</li> : null}
                </ol>
            </div>
        );
    }
}

class DashboardMainContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            breadcrumb: props.breadcrumb
        };
    }

    componentWillReceiveProps(props) {
        if (this.state.breadcrumb !== props.breadcrumb) {
            this.setState({
                breadcrumb: props.breadcrumb
            });
        }
    }

    render() {
        return (
            <div className="main-content-container" role="main">
                <DashboardBreadCrumbPanel breadcrumb={this.state.breadcrumb}/>
                <div className="dashboard-components-container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

class AnonymousDashboard extends Component {
    render() {
        return (
            <div className="dashboard-container anonymous">
                <div className="logo"/>
            </div>
        )
    }
}
