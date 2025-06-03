import { useState } from "react";

const Todos = () => {
  const [todos, setTodos] = useState([
    "Add salary details in system",
    "Announcement for holiday",
    "Call bus driver",
    "Office Picnic",
    "Website Must Be Finished",
    "Recharge My Mobile",
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, newTodo]);
      setNewTodo("");
    }
  };

  const removeTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <section className="w-full max-w-7xl flex flex-col lg:flex-row gap-8">
      {/* TODO List Section */}
      <div className="w-full lg:w-1/3">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">TODO List</h2>

          <ul className="mb-6 divide-y divide-gray-200">
            {todos.map((todo, index) => (
              <li 
                key={index} 
                className="flex justify-between items-center py-4 hover:bg-gray-50 transition-colors duration-150"
              >
                <span className="text-gray-700">{todo}</span>
                <button
                  onClick={() => removeTodo(index)}
                  className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                >
                  ✖
                </button>
              </li>
            ))}
            {todos.length === 0 && (
              <li className="py-4 text-center text-gray-500 italic">
                No todos yet. Add one above!
              </li>
            )}
          </ul>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="flex-grow border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter Todo..."
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <button
              onClick={addTodo}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newTodo.trim()}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Todos;
