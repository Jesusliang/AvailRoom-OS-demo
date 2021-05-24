import "./App.css";
import DraggableComponent from "./components/draggableComponent/DraggableComponent";

function App() {
  return (
    <div className="App">
      <h1>Esta es una pagina de fondo</h1>

      <DraggableComponent
        isChanging={(changing) => {
          console.log(changing);
        }}
      >
        <iframe
          src="http://www.youtube.com/embed/xDMP3i36naA"
          frameborder="0"
          height="100%"
          width="100%"
        ></iframe>
      </DraggableComponent>
    </div>
  );
}

export default App;
