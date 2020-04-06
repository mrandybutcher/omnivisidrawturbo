import React from 'react'
import styles from "./Menu.module.scss"

function onNoOp(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault()
    e.stopPropagation()
}

function Menu() {
    return (
        <div className={styles.root}>
            <div className={styles.dropdown} onClick={onNoOp}>
                <button className={styles.dropbtn} onClick={onNoOp}>File &#9662; </button>
                <div className={styles.dropdowncontent}>
                    <a href="/" onClick={onNoOp}>New...</a>
                    <a href="/" onClick={onNoOp}>Open from</a>
                    <a href="/" onClick={onNoOp}>Open recent</a>
                    <a href="/" onClick={onNoOp}>Save</a>
                    <a href="/" onClick={onNoOp}>Save as</a>
                    <a href="/" onClick={onNoOp}>Rename</a>
                    <a href="/" onClick={onNoOp}>Make a copy</a>
                    <a href="/" onClick={onNoOp}>Import from</a>
                    <a href="/" onClick={onNoOp}>Export as</a>
                    <a href="/" onClick={onNoOp}>New library</a>
                    <a href="/" onClick={onNoOp}>Open library from</a>
                    <a href="/" onClick={onNoOp}>Page setup...</a>
                    <a href="/" onClick={onNoOp}>Print...</a>
                    <a href="/" onClick={onNoOp}>Close</a>
                </div>
            </div>
            <a href="/" onClick={onNoOp}>Edit</a>
            <a href="/" onClick={onNoOp}>View</a>
            <a href="/" onClick={onNoOp}>Extras</a>
            <a href="/" onClick={onNoOp}>Help</a>
        </div>
    )
}

export default Menu
