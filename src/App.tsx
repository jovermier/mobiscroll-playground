import { Calendar } from './calendar';
import './App.css';
import EventType1Provider from './context-providers/EventType1DataProvider';
import EventType2Provider from './context-providers/EventType2DataProvider';

function App() {
  return (
    <div className="App">
      <EventType1Provider>
        <EventType2Provider>
          <Calendar />
        </EventType2Provider>
      </EventType1Provider>
    </div>
  );
}

export default App;
