import React,{useState,useEffect,useRef} from "react";
import './App.css';

function RightClickMenu() {
  const [menuVisible,setMenuVisible] = useState(false);
  const [menuPosition,setMenuPosition] = useState({x:0,y:0});
  const [adjustedPosition,setAdjustedPosition] = useState({x:0,y:0});
  const menuRef = useRef(null);

  useEffect(()=> {
    if(menuVisible && menuRef.current) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const menuWidth = 260;
      const menuHeight = menuRef.current.offsetHeight;

      let xPos = menuPosition.x;
      let yPos = menuPosition.y;

      if(xPos+menuWidth>viewportWidth) {
        xPos = viewportWidth - menuWidth;
      }
      if(yPos+menuHeight>viewportHeight) {
        yPos = viewportHeight - menuHeight;
      }
      
      setAdjustedPosition({x:xPos, y:yPos});
    }
  },[menuVisible,menuPosition]
);

const handleRightClick = (e) => {
  e.preventDefault();
  setMenuPosition({x:e.clientX, y: e.clientY});
  setMenuVisible(true);
};

const handleClick = () => {
  setMenuVisible(false);
}

return (
  <div onContextMenu={handleRightClick} onClick={handleClick} style={{height: '100vh', overflow: 'hidden'}}>
    {menuVisible && (
      <ul ref={menuRef} className="context-menu" style={{top:`${adjustedPosition.y}px`, left: `${adjustedPosition.x}px`}} >
        <li>
          <img src="edit.png" alt="Edit" />
          Edit
        </li>
        <li>
          <img src="rename.png" alt="Rename" />
          Rename
        </li>
        <hr class="menu-divider" />
        <li>
          <img src="copy.png" alt="Copy" />
          Copy
        </li>
        <li>
          <img src="paste.png" alt="Paste" />
          Paste
        </li>
        <hr class="menu-divider" />
        <li className="has-submenu">
          <img src="share.png" alt="Share" />
          Share
          <ul className="submenu" style={{
            top: '0px',
            left:`${adjustedPosition.x+250+150> window.innerWidth ? -150 :250}px`,
          }} >
          <li>
            <img src="email.png" alt="Email" />
            Email
          </li>
          <li>
            <img src="x.png" alt="X" />
            X
          </li>
          <li>
            <img src="facebook.png" alt="Facebook" />
            Facebook
          </li>
          </ul>
        </li>
        <hr className="menu-divider" />
        <li>
            <img src="delete.png" alt="Delete" />
            Delete
         </li>
         <li>
            <img src="download.png" alt="Download" />
            Download
         </li>
      </ul>
    )}
  </div>
)

}

export default RightClickMenu;
