import React, { useState } from 'react';

const ListItem = ({ text }) => {
  const [value, setValue] = useState('');
  console.log(`${text} 렌더링`);

  return (
    <div>
      <span>{text}: </span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="입력해보세요"
      />
    </div>
  );
};

const App = () => {
  const [items, setItems] = useState([
    { text: 'A' },
    { text: 'B' },
    { text: 'C' },
  ]);

  const addItem = () => {
    setItems([
      { text: 'F' },
      ...items,
    ]);
  };

  return (
    <div>
      <h2>key: index (비정상)</h2>
      <button onClick={addItem}>Add Item</button>
      {items.map((item, index) => (
        <ListItem key={index} text={item.text} />
      ))}
    </div>
  );
};

export default App;
