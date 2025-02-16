import { useState, useRef, useEffect } from "react"
import {motion} from "framer-motion"
import { MessageCircle, Inbox, Flag, Pencil, Share, Menu } from "lucide-react"

const items = [
    { id: "comment", icon: MessageCircle, label: "Comment", color: "bg-blue-500", top: true },
    { id: "inbox", icon: Inbox, label: "Inbox", color: "bg-orange-500", top: true },
    { id: "feature", icon: Flag, label: "Feature Flag", color: "bg-green-500", top: true },
    { id: "draft", icon: Pencil, label: "Draft Mode", color: "bg-emerald-500", top: false },
    { id: "share", icon: Share, label: "Share", color: "bg-red-500", top: false },
    { id: "menu", icon: Menu, label: "Menu", color: "bg-purple-500", top: false },
]

export default function Toolbar() {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0, width: 0, height : 0})
    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])
    const toolbarRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (hoveredItem) {
            const buttonIndex = items.findIndex((item) => item.id === hoveredItem)
            const button = buttonsRef.current[buttonIndex]
            if (button && toolbarRef.current) {
                const rect = button.getBoundingClientRect()
                const parentRect = toolbarRef.current.getBoundingClientRect()
                setHoverPosition({
                    x: rect.left - parentRect.left,
                    y: rect.top - parentRect.top,
                    width: rect.width,
                    height: rect.height
                })
            }
        }
    }, [hoveredItem])

    return (
        <div className="relative h-screen w-full bg-black flex items-center justify-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Top labels */}
                <div className="flex gap-10 mb-20">
                    {items
                        .filter((item) => item.top)
                        .map((item, index) => (
                            <motion.div
                                key={item.id}
                                animate={{
                                    opacity: !hoveredItem || hoveredItem === item.id ? 1 : 0.3,
                                    filter: hoveredItem && hoveredItem !== item.id ? "blur(2px)" : "blur(0px)",
                                }}
                                className={`${item.color} px-4 py-1.5 rounded-xl text-white font-medium`}
                                style={{
                                    transform: `rotate(${(index - 1) * 6}deg) translateY(${(index - 1) * 5}px)`,
                                }}
                            >
                                {item.label}
                            </motion.div>
                        ))}
                </div>

                {/* Toolbar */}
                <div ref={toolbarRef} className="relative bg-zinc-900 rounded-full px-4 py-4 flex items-center gap-2">
                    {/* Background hover effect */}
                    <motion.div
                        className="absolute bg-zinc-800 w-full rounded-full"
                        animate={{
                            x: hoverPosition.x - 18,
                            y: hoverPosition.y - 5,
                            height: hoverPosition.height + 11,
                            width: hoverPosition.width + 4,
                            opacity: hoveredItem ? 1 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ height: "100%", top: 0 }}
                    />

                    {/* Tooltips */}
                    <div className="absolute group -top-10 left-0 right-0 h-8 flex items-center">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                className="absolute bg-zinc-900 px-2 py-1 rounded text-white text-sm whitespace-nowrap"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: hoveredItem === item.id ? 1 : 0,
                                    x: hoverPosition.x,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            >
                                {item.label}
                            </motion.div>
                        ))}
                    </div>

                    {/* Icons */}
                    {items.map((item, index) => (
                        <button
                            key={item.id}
                            ref={(el) => (buttonsRef.current[index] = el)}
                            className="relative py-2 px-3 text-white"
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                        >
                            <item.icon size={28} />
                        </button>
                    ))}
                </div>

                {/* Bottom labels */}
                <div className="flex gap-12 mt-20">
                    {items
                        .filter((item) => !item.top)
                        .map((item, index) => (
                            <motion.div
                                key={item.id}
                                animate={{
                                    opacity: !hoveredItem || hoveredItem === item.id ? 1 : 0.3,
                                    filter: hoveredItem && hoveredItem !== item.id ? "blur(2px)" : "blur(0px)",
                                }}
                                className={`${item.color} px-4 py-1.5 rounded-xl text-white font-medium`}
                                style={{
                                    transform: `rotate(${(index - 1) * -6}deg) translateY(${(index - 1) * -5}px)`,
                                }}
                            >
                                {item.label}
                            </motion.div>
                        ))}
                </div>
            </div>
        </div>
    )
}

