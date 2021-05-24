import "./App.css";
import DraggableComponent from "./components/draggableComponent/DraggableComponent";

function App() {
  return (
    <div className="App">
      <h1>Esta es una pagina de fondo</h1>
      <DraggableComponent>
        <h1>Hola</h1>
      </DraggableComponent>
    </div>
  );
}

export default App;
