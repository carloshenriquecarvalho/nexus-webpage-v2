import { useState } from "react"

export function MenuButton() {
    const [menu, setMenu] = useState(false);

    

    const showMenu = () => {

    }
    return (
        <button className="cursor-pointer liquid-glass text-[var(--foreground)] px-6 py-2 rounded-full font-medium pointer-events-auto hover:bg-white/20 transition-colors">
          Menu
        </button>
    )
}
         