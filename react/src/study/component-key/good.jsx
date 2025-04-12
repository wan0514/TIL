import React, { useState, useRef } from 'react';

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
    { id: 0, text: 'A' },
    { id: 1, text: 'B' },
    { id: 2, text: 'C' },
  ]);

  const nextId = useRef(3); // 다음 id 값을 기억

  const addItem = () => {
    const newItem = { id: nextId.current, text: `F${nextId.current}` };
    nextId.current += 1;

    setItems([newItem, ...items]);
  };

  return (
    <div>
      <h2>key: id (정상)</h2>
      <button onClick={addItem}>Add Item</button>
      {items.map(item => (
        <ListItem key={item.id} text={item.text} />
      ))}
    </div>
  );
};

export default App;
