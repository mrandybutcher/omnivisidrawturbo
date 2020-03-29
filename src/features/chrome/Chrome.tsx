import React from "react";
import styles from "./Chrome.module.scss"
import StatusBar from "./StatusBar";
import ElementPropertiesPane from "../elements/ElementPropertiesPane";
import ElementTypesPane from "../elementTypes/ElementTypesPane";
import ElementListPane from "../elements/ElementListPane";
import {SelectionPane} from "../selection/SelectionPane";
import Toolbar from "./Toolbar";
import Mainmenu from '../navigation/mainmenu';
import {Navbar } from 'react-bootstrap';

interface ChromeProps {
    children: React.ReactNode;
}

export default function Chrome({children}: ChromeProps) {
    return (
        <div className={styles.root}>
            <div className={styles.header}>
<<<<<<< HEAD
                {/* <b>OmniVisiDraw TURBO &nbsp;</b> */}
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand>OmniVisiDraw TURBO &nbsp;</Navbar.Brand>
                    <Mainmenu/>
                </Navbar>
                
=======
                <h1>OmniVisiDraw TURBO &nbsp;</h1>
>>>>>>> upstream/master
                <Toolbar/>
            </div>
            <div className={styles.middle}>
                <div className={styles.left}>
                    <ElementTypesPane/>
                    <ElementListPane/>
                </div>
                <div className={styles.main}>
                    {children}
                </div>
                <div className={styles.right}>
                    <SelectionPane/>
                    <ElementPropertiesPane/>
                </div>
            </div>
            <div className={styles.footer}><StatusBar/></div>
        </div>
    )
}

