import React from "react";
import styles from "./Pane.module.css"

interface PaneProps {
    title: string
    children: React.ReactNode;
}

export function Pane(props: PaneProps) {
    return <div className={styles.root}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.content}>
            {props.children}
        </div>
    </div>
}