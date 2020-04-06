import React, {useCallback, useState} from "react";
import styles from "./Pane.module.scss"

interface PaneProps {
    title: string
    children: React.ReactNode;
}

enum Icon {
    Expanded,
    Collapeed
}

function getIcon(icon: Icon, onIconClick: (e: React.MouseEvent<Element>) => void) {
    if (icon === Icon.Expanded) {
        return <span onClick={onIconClick}>&#9660;</span>
    } else {
        return <span onClick={onIconClick}>&#9654;</span>
    }
}


export function Pane(props: PaneProps) {
    const [expanded, setExpanded] = useState(Icon.Expanded as Icon)

    const onIconClick = useCallback((e) => {
        setExpanded(expanded === Icon.Expanded ? Icon.Collapeed : Icon.Expanded)
    }, [expanded])

    return <div className={styles.root}>
        <div className={styles.title}>{getIcon(expanded, onIconClick)} {props.title}</div>
        {expanded === Icon.Expanded && <div className={styles.content}> {props.children} </div>}
    </div>
}