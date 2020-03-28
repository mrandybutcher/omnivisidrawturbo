import React from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import {Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import Home from '../pages/home'
import File from '../pages/file'
import Edit from '../pages/edit'
import View from '../pages/view'
import Extras from '../pages/extras'
import Help from '../pages/help'

function Mainmenu() {
    return (
        <Router>
            <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <NavDropdown title="File" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="/file">New...</NavDropdown.Item>
                    <NavDropdown.Item href="#">Open from</NavDropdown.Item>
                    <NavDropdown.Item href="#">Open recent</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#">Save</NavDropdown.Item>
                    <NavDropdown.Item href="#">Save</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#">Rename</NavDropdown.Item>
                    <NavDropdown.Item href="#">Make a Copy</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#">Import from</NavDropdown.Item>
                    <NavDropdown.Item href="#">Export as</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#">Embed</NavDropdown.Item>
                    <NavDropdown.Item href="#">Publish</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#">Import from</NavDropdown.Item>
                    <NavDropdown.Item href="#">Export as</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#">New library</NavDropdown.Item>
                    <NavDropdown.Item href="#">Open library from</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#">Page setup...</NavDropdown.Item>
                    <NavDropdown.Item href="#">Print...</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#">Close</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/edit">Edit</Nav.Link>
                <Nav.Link href="/view">View</Nav.Link>
                <Nav.Link href="/extras">Extras</Nav.Link>
                <Nav.Link href="/help">Help</Nav.Link>
                <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-info">Search</Button>
                </Form>
            </Nav>
            <Route path="/" exact component={Home} />
            <Route path="/file" exact component={File} />
            <Route path="/edit" exact component={Edit} />
            <Route path="/view" exact component={View} />
            <Route path="/extras" exact component={Extras} />
            <Route path="/help" exact component={Help} />
        </Router>
    )
}

export default Mainmenu
