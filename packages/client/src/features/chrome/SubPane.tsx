import React from "react";
import styles from "./SubPane.module.scss"

interface SubPaneProps {
    title: string
    children: React.ReactNode;
}

export function SubPane(props: SubPaneProps) {
    return <div className={styles.root}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.content}>
            {props.children}
        </div>
    </div>
}
