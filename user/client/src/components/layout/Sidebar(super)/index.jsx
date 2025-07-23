import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from "@/lib/axios";
import { 
  LogOut, 
  MessageSquare, 
  Building, 
  Briefcase, 
  School, 
  BarChart, 
  List, 
  UserPlus,
  Users,
  TrendingUp,
  Target
} from 'lucide-react';
import Logo from '/logo-white.png'; // Update this path to your logo

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // Close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // Close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
  }, [sidebarExpanded]);

  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        ref={sidebar}
        className={`absolute left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-slate-800 text-white duration-300 ease-linear lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-slate-700`}
      >
        {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5 border-b border-slate-700">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-12 w-auto mt-2 ml-3" />
          </div>
          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block lg:hidden p-2 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
        {/* SIDEBAR HEADER */}

        <div className="flex flex-col flex-grow overflow-y-auto duration-300 ease-linear">
          {/* Sidebar Menu */}
          <nav className="mt-2 py-4 px-4 lg:px-6">
            <div>
              <ul className="mb-6 flex flex-col gap-2">
                {/* Institutes Dropdown */}
                <SidebarLinkGroup activeCondition={pathname.includes('institutes')}>
                  {(handleClick, open) => (
                    <>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-slate-700 ${
                          pathname.includes('institutes') && 'bg-slate-700 text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      >
                        <Building size={20} className="text-slate-400 group-hover:text-white" />
                        <span>Institutes</span>
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-transform duration-200 ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                          />
                        </svg>
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                      >
                        <ul className="mt-2 mb-4 flex flex-col gap-2 pl-6">
                          <li>
                            <NavLink
                              to="/Institute-Analysis"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-3 rounded-md px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white bg-slate-700/50 rounded-lg')
                              }
                            >
                              <BarChart size={18} className="text-slate-400 group-hover:text-white" />
                              Institute Analysis
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/Institute-List"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-3 rounded-md px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white bg-slate-700/50 rounded-lg')
                              }
                            >
                              <List size={18} className="text-slate-400 group-hover:text-white" />
                              Manage Institutes
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>

                {/* Corporates Dropdown */}
                <SidebarLinkGroup activeCondition={pathname.includes('admins')}>
                  {(handleClick, open) => (
                    <>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-slate-700 ${
                          pathname.includes('admins') && 'bg-slate-700 text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      >
                        <Briefcase size={20} className="text-slate-400 group-hover:text-white" />
                        <span>Corporates</span>
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-transform duration-200 ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                          />
                        </svg>
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                      >
                        <ul className="mt-2 mb-4 flex flex-col gap-2 pl-6">
                          <li>
                            <NavLink
                              to="/corporate-Analysis"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-3 rounded-md px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white bg-slate-700/50 rounded-lg')
                              }
                            >
                              <BarChart size={18} className="text-slate-400 group-hover:text-white" />
                              Corporate Analysis
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/corporate-List"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-3 rounded-md px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white bg-slate-700/50 rounded-lg')
                              }
                            >
                              <List size={18} className="text-slate-400 group-hover:text-white" />
                              Manage Corporates
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>

                {/* School Dropdown */}
                <SidebarLinkGroup activeCondition={pathname.includes('School')}>
                  {(handleClick, open) => (
                    <>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-slate-700 ${
                          pathname.includes('School') && 'bg-slate-700 text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      >
                        <School size={20} className="text-slate-400 group-hover:text-white" />
                        <span>Schools</span>
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-transform duration-200 ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                          />
                        </svg>
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                      >
                        <ul className="mt-2 mb-4 flex flex-col gap-2 pl-6">
                          <li>
                            <NavLink
                              to="/School-Analysis"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-3 rounded-md px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white bg-slate-700/50 rounded-lg')
                              }
                            >
                              <BarChart size={18} className="text-slate-400 group-hover:text-white" />
                              Schools Analysis
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/School-List"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-3 rounded-md px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white bg-slate-700/50 rounded-lg')
                              }
                            >
                              <List size={18} className="text-slate-400 group-hover:text-white" />
                              Manage Schools
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>

                {/* Lead Management Dropdown */}
                <SidebarLinkGroup activeCondition={pathname.includes('lead')}>
                  {(handleClick, open) => (
                    <>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-slate-700 ${
                          pathname.includes('lead') && 'bg-slate-700 text-white'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      >
                        <Target size={20} className="text-slate-400 group-hover:text-white" />
                        <span>Lead Management</span>
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-transform duration-200 ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                          />
                        </svg>
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'}`}
                      >
                        <ul className="mt-2 mb-4 flex flex-col gap-2 pl-6">
                          <li>
                            <NavLink
                              to="/lead-dashboard"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-3 rounded-md px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white bg-slate-700/50 rounded-lg')
                              }
                            >
                              <TrendingUp size={18} className="text-slate-400 group-hover:text-white" />
                              Lead Dashboard
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/lead-management"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-3 rounded-md px-4 py-2 font-medium text-gray-300 duration-300 ease-in-out hover:text-white ' +
                                (isActive && '!text-white bg-slate-700/50 rounded-lg')
                              }
                            >
                              <Users size={18} className="text-slate-400 group-hover:text-white" />
                              Manage Leads
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  )}
                </SidebarLinkGroup>

                <div className="my-2 h-px bg-slate-700/50"></div>

                {/* Contact Requests Link */}
                <li>
                  <NavLink
                    to="/contact-requests"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-slate-700 ' +
                      (isActive && 'bg-slate-700 text-white')
                    }
                  >
                    <MessageSquare size={20} className="text-slate-400 group-hover:text-white" />
                    <span>Contact Requests</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/create-admin"
                    className={({ isActive }) =>
                      'group relative flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-gray-300 duration-300 ease-in-out hover:bg-slate-700 ' +
                      (isActive && 'bg-slate-700 text-white')
                    }
                  >
                    <UserPlus size={20} className="text-slate-400 group-hover:text-white" />
                    <span>Add New Admin</span>
                  </NavLink>
                </li>

                {/* More links can go here */}
              </ul>
            </div>
          </nav>
        </div>
        
        <div className="mt-auto px-6 py-6 border-t border-slate-700">
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-red-600 text-white text-base font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Navbar when Sidebar is closed and only for small screens */}
      {!sidebarOpen && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-slate-800 text-white flex items-center justify-between p-4 lg:hidden shadow-md">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-300 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <img src={Logo} alt="Logo" className="h-10 w-auto mx-auto" />
        </div>
      )}
    </div>
  );
};

export default Sidebar;