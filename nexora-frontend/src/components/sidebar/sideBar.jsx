import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react"
// import {logo} from "../assets/logo.png"
// import {profile} from "../../assets/profile.png"
import { createContext, useContext, useState } from "react"
import { Link } from "react-router-dom"
import './sidebar.css'
import { useDispatch, useSelector } from "react-redux";
import { Expand } from "../../features/authfunctions/userLogin";
import { Tooltip } from 'antd';
const SidebarContext = createContext();

export default function Sidebar({ children }) {
    // const [expand, setExpanded] = useState(true)
    const dispatch = useDispatch()
    const { expand } = useSelector(
        (state) => state.remaining
    );

    const user=useSelector(
        (state) => state.user
    );

    const BRAND_NAME = "Nexora";
    const BRAND_EMAIL = "demo@nexora.local";

    const normalizeBrand = (value, fallback) => {
        const text = String(value || "").trim();
        if (!text) return fallback;

        const lower = text.toLowerCase();
        const compact = lower.replace(/[^a-z0-9]/g, "");

        // Force old branding to the new one (covers stale localStorage/API data)
        // Uses a compacted version to catch variants like "Manage X" or "manage_x".
        if (compact.includes("managex")) {
            return fallback;
        }

        if (lower.includes("karmacts") || lower === "ksm" || lower === "kms") {
            return fallback;
        }

        return text;
    };

    const company_name = normalizeBrand(user?.user?.companyMaster?.name, BRAND_NAME);
    const company_email = normalizeBrand(user?.user?.email, BRAND_EMAIL);

    // (branding only) keep logs off in production


    return (
        <>
            {/* <aside className="h-screen" style={{position:"sticky",top:"0px", zIndex: "1"}}>
                <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                    <div className="p-4 pb-2 flex justify-between mb-3 items-center">
                        <span className={`overflow-hidden transition-all text-lg font-semibold ${expand ? "w-26" : "w-0"}`}>Nexora</span>
                        <button onClick={() => dispatch(Expand(!expand))} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                            {expand ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>
                    <SidebarContext.Provider value={{ expand }}>
                        <ul className="flex-1 px-3">{children}</ul>
                    </SidebarContext.Provider>
                    <div className="border-t flex p-3">
                        <div className={`flex justify-between items-center overflow-hidden transition-all ${expand ? "w-22 ml-3" : "w-0"} `}>
                            <div className="leading-4">
                                <h4 className="font-semibold">Nexora</h4>
                                <span className="text-xs text-gray-600">support@nexora.local</span>
                            </div>
                            <MoreVertical size={20} />
                        </div>
                    </div>
                </nav>
            </aside> */}

            <aside className="h-screen" style={{ position: "sticky", top: "0px", zIndex: "1" }}>
                <nav className="h-full flex flex-col bg-white border-r shadow-sm sidebar-scroll">
                    <div className="p-4 pb-2 flex justify-between mb-3 items-center">
                        <span className={`overflow-hidden transition-all text-lg font-semibold ${expand ? "w-26" : "w-0"}`}>{BRAND_NAME}</span>
                        <button onClick={() => dispatch(Expand(!expand))} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                            {expand ? <ChevronFirst /> : <ChevronLast />}
                        </button>
                    </div>
                    <SidebarContext.Provider value={{ expand }}>
                        <ul className="flex-1 px-3">{children}</ul>
                    </SidebarContext.Provider>
                    <div className="border-t flex p-3">
                        <div className={`flex justify-between items-center overflow-hidden transition-all ${expand ? "w-22 ml-3" : "w-0"} `}>
                            <div className="leading-4">
                                <h4 className="font-semibold">{company_name}</h4>
                                <span className="text-xs text-gray-600">{company_email}</span>
                            </div>
                            <MoreVertical size={20} />
                        </div>
                    </div>
                </nav>
            </aside>


        </>
    )
}

export function SidebarItem({ icon, text, active, alert, to, onClick }) {
    const { expand } = useContext(SidebarContext)
    return (
        <Tooltip title={text} placement="right" open={!expand ? undefined : false}>
            <Link to={to} onClick={onClick}>
                <li className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-tr bg-teal-50 text-teal-600" : "hover:bg-teal-50 text-gray-500"}`}>
                    {icon}
                    <span className={`overflow-hidden transition-all ${expand ? "w-22 ml-3" : "w-0"}`}>
                        {text}
                    </span>
                    {alert && (
                        <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expand ? "" : "top-2"}`}>

                        </div>
                    )}

                    {!expand && (
                        <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                            {text}
                        </div>
                    )}
                </li>
            </Link>
        </Tooltip>
    )
}