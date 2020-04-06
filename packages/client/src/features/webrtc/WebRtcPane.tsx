import React, {useState} from "react"
// import {Pane} from "../chrome/Pane";
// import {useDispatch, useSelector} from "react-redux";
// import {selectConnected, selectUserId, selectUserName, selectUsers} from "../../app/selectors";
// import {connectToUser, updateName} from "./actions";
//
// export default function WebRtcPane() {
//     const userName              = useSelector(selectUserName)
//     const userId                = useSelector(selectUserId)
//     const connected             = useSelector(selectConnected)
//     const users                 = useSelector(selectUsers)
//     const [newName, setNewName] = useState<string | undefined>(undefined)
//     const dispatch              = useDispatch()
//
//     function onChange(e: React.FormEvent<HTMLInputElement>) {
//         setNewName(e.currentTarget.value)
//     }
//
//     function onTickClick(e: React.FormEvent<HTMLButtonElement>) {
//         if (newName) {
//             dispatch(updateName(newName))
//         }
//         setNewName(undefined)
//     }
//
//     function onCrossClick(e: React.FormEvent<HTMLButtonElement>) {
//         setNewName(undefined)
//     }
//
//     return (
//         <Pane title="WebRTC Pane">
//             <label>
//                 Your Name:
//                 <input value={newName || userName} onChange={onChange}/>
//             </label>
//             {newName && <button onClick={onTickClick}>&#10003;</button>}
//             {newName && <button onClick={onCrossClick}>&#10007;</button>}
//             {connected ? <b>Connected</b> : <b>Not connected</b>}
//             <ul style={{paddingLeft: "1em"}}>
//                 {Array.isArray(users) && users.map((user, idx) => {
//                     if (user.id === userId) {
//                         return null;
//                     }
//                     return <li key={idx}>{user.userName} &nbsp;
//                         {user.status ? <b>{user.status}</b> :
//                             <button onClick={() => {
//                                 dispatch(connectToUser({recipientId: user.id}))
//                             }}>Connect</button>
//                         }
//                     </li>
//                 })}
//             </ul>
//         </Pane>
//     );
//
// }