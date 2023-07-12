import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  transition: 0.2s;
  font-size: 16px;
  font-family: Actor, sans-serif;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const Col = styled.div`
  flex: 1 0 0%;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  text-align: center;
  color: #bf4f74;
`;

const TodoListContainer = styled.ul`
  padding-left: 0;

  li {
    list-style: none;
  }
`;

const ListItem = styled.li`
  position: relative;
  margin-bottom: 0.25rem;
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  border-top: 1px solid #ccc;

  &:last-child {
    border-bottom: 1px solid #ccc;
  }

  .btn-danger {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }

  &.done {
    .form-check-label {
      color: #999;
      text-decoration: line-through;
    }
  }

  .form-check-label {
    width: 100%;

    .form-check-input {
      margin-right: 1rem;
    }
  }
`;

const Button = styled.button`
  width: 100%;
  max-width: 200px;
  background: #bf4f74;
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem;
  border: 2px solid #bf4f74;
  border-radius: 3px;
  font-family: Actor, sans-serif;

  &:disabled {
    background: #fff;
    color: #bf4f74;
  }

  &:hover {
    background: #bf4f74;
    color: #fff;
  }
`;

const DeleteSelectedButton = styled(Button)`
  margin: 0.5rem 0;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  display: ${(props) => (props.disabled ? "none" : "block")};
`;

const TextButton = styled.button`
  background: none;
  border: 0;
  display: block;
  margin-top: 1.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const XButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border: 0;
  background: 0;

  &:hover {
    transform: scale(1.5);
  }
`;

const Input = styled.input`
  width: 100%;
  max-width: 180px;
  display: block;
  padding: 0.5rem;
  border: 2px solid pink;
  border-radius: 3px;
  font-size: 1rem;
  font-family: Actor, sans-serif;
  margin-right: 0.2rem;
`;

const TodoApp = () => {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (window.localStorage.getItem("todolist") !== null) {
      const savedList = JSON.parse(window.localStorage.getItem("todolist"));
      setItems(savedList);
    }
    return;
  }, []);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleAddItem = (event) => {
    event.preventDefault();

    const newItem = {
      id: Date.now(),
      text: text,
      done: false
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setText("");
  };

  const markItemCompleted = (itemId) => {
    const updatedItems = items.map((item) => {
      if (itemId === item.id) {
        return { ...item, done: !item.done };
      }
      return item;
    });

    setItems(updatedItems);
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);

    setItems(updatedItems);
  };

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const handleDeleteSelectedItems = () => {
    const updatedItems = items.filter(
      (item) => !selectedItems.includes(item.id)
    );
    setItems(updatedItems);
    setSelectedItems([]);
  };

  const handleSave = () => {
    window.localStorage.setItem("todolist", JSON.stringify(items));
    window.alert("Your list has been saved!");
  };

  const handleDeleteTodo = () => {
    if (
      window.confirm("Are you sure you want to delete your current todo list?")
    ) {
      setItems([]);
      window.localStorage.removeItem("todolist");
    }
  };

  return (
    <AppContainer>
      <Title>TODO LIST</Title>
      <Row>
        <Col>
          <TodoList
            items={items}
            onItemCompleted={markItemCompleted}
            onDeleteItem={handleDeleteItem}
            isChecked={(itemId) => selectedItems.includes(itemId)}
            onCheckboxChange={handleCheckboxChange}
          />
        </Col>
      </Row>
      <Row>
        <DeleteSelectedButton
          onClick={handleDeleteSelectedItems}
          disabled={selectedItems.length === 0}
          type="button"
        >
          Delete Selected Items
        </DeleteSelectedButton>
      </Row>
      <form>
        <Row>
          <Col>
            <Input
              type="text"
              onChange={handleTextChange}
              placeholder="Enter a todo"
              value={text}
            />
          </Col>
          <Col>
            <Button onClick={handleAddItem} disabled={text.length === 0}>
              {"Add #" + (items.length + 1)}
            </Button>
          </Col>
        </Row>
      </form>
      <Row>
        <TextButton type="button" onClick={handleSave}>
          <span role="img" aria-label="floppy disk">
            💾
          </span>{" "}
          Save todo list (will auto load after refresh)
        </TextButton>
      </Row>
      <Row>
        <TextButton type="button" onClick={handleDeleteTodo}>
          <span role="img" aria-label="wastebasket">
            🗑️
          </span>{" "}
          Delete current todo list
        </TextButton>
      </Row>
    </AppContainer>
  );
};

const TodoItem = ({
  id,
  text,
  completed,
  onItemCompleted,
  onDeleteItem,
  isChecked,
  onCheckboxChange
}) => {
  const listItemRef = useRef(null);

  const handleCheckboxChange = () => {
    onCheckboxChange(id);
    onItemCompleted(id);
  };

  const deleteItem = () => {
    onDeleteItem(id);
  };

  const itemClass = `form-check todoitem ${completed ? "done" : "undone"}`;

  return (
    <ListItem className={itemClass} ref={listItemRef}>
      <label className="form-check-label">
        <input
          type="checkbox"
          className="form-check-input"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        {text}
      </label>

      <XButton type="button" onClick={deleteItem}>
        <span role="img" aria-label="cross mark">
          ❌
        </span>
      </XButton>
    </ListItem>
  );
};

const TodoList = ({
  items,
  onItemCompleted,
  onDeleteItem,
  isChecked,
  onCheckboxChange
}) => {
  return (
    <TodoListContainer>
      {items.map((item) => (
        <TodoItem
          key={item.id}
          id={item.id}
          text={item.text}
          completed={item.done}
          onItemCompleted={onItemCompleted}
          onDeleteItem={onDeleteItem}
          isChecked={isChecked(item.id)}
          onCheckboxChange={onCheckboxChange}
        />
      ))}
    </TodoListContainer>
  );
};

export default TodoApp;
