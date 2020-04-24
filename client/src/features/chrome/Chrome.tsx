import React from "react";
import styles from "./Chrome.module.scss"
import StatusBar from "./StatusBar";
import ElementPropertiesPane from "../elements/ElementPropertiesPane";
import ElementTypesPane from "../elementTypes/ElementTypesPane";
import ElementListPane from "../elements/ElementListPane";
import {SelectionPane} from "../selection/SelectionPane";
import Toolbar from "./Toolbar";
import PresencePane from "../connection/PresencePane"
import ConnectionPane from "../connection/ConnectionPane"
import HistoryPane from "../history/HistoryPane"

// import WebRtcPane from "../webrtc/WebRtcPane";

interface ChromeProps {
    children: React.ReactNode;
}

export default function Chrome({children}: ChromeProps) {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <h1 style={{float: "left"}}>OmniVisiDraw TURBO &nbsp;</h1>
                {/*<Menu/>*/}
                <Toolbar/>
            </div>
            <div className={styles.middle}>
                <div className={styles.left}>
                    <ElementTypesPane/>
                    <ElementListPane/>
                    <PresencePane/>
                    <ConnectionPane/>
                </div>
                <div className={styles.main}>
                    {children}
                </div>
                <div className={styles.right}>
                    <SelectionPane/>
                    <ElementPropertiesPane/>
                    <HistoryPane/>
                </div>
            </div>
            <div className={styles.footer}><StatusBar/></div>
        </div>
    )
}

