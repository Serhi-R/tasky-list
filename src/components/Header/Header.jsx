import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import './Header.scss';

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Task', href: '#', current: false },
  { name: '', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Header() {
  return (
    <Disclosure as="nav" className="header-nav">
      <div className="header-container">
        <div className="header-inner">
          <div className="mobile-menu-button">
            <DisclosureButton className="mobile-button">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="icon-bars" />
              <XMarkIcon aria-hidden="true" className="icon-close" />
            </DisclosureButton>
          </div>

          <div className="header-left">
            <div className="logo">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
              />
            </div>

            <div className="nav-links">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                  className={classNames(
                    item.current ? 'active-link' : 'link',
                  )}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="header-right">
            <button type="button" className="notification-button">
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="icon-bell" />
            </button>

            <Menu as="div" className="profile-menu">
              <div>
                <MenuButton className="profile-button">
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src=""
                  />
                </MenuButton>
              </div>
              <MenuItems className="profile-dropdown">
                <MenuItem>
                  <a href="#" className="dropdown-link">Your Profile</a>
                </MenuItem>
                <MenuItem>
                  <a href="#" className="dropdown-link">Settings</a>
                </MenuItem>
                <MenuItem>
                  <a href="#" className="dropdown-link">Sign out</a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="mobile-panel">
        {navigation.map((item) => (
          <DisclosureButton
            key={item.name}
            as="a"
            href={item.href}
            aria-current={item.current ? 'page' : undefined}
            className={classNames(
              item.current ? 'active-link-mobile' : 'link-mobile',
            )}
          >
            {item.name}
          </DisclosureButton>
        ))}
      </DisclosurePanel>
    </Disclosure>
  );
}
