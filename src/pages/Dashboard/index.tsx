import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditingFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  available: boolean;
}

function Dashboard() {
  const [foods, setFoods] = useState<FoodProps[]>([])
  const [editingFood, setEditingFood] = useState({} as FoodProps)
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);

  useEffect(() => {
    api.get('/foods').then((response) => {
      setFoods(response.data);
    })
  }, [])

  async function handleAddFood(food: FoodProps) {
    try {
      const response = await api.post<FoodProps>('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodProps) {
    try {
      const response = await api.put<FoodProps>(
        `/foods/${food.id}`, food,
      );
      const foodUpdated = response.data
      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.id ? f : foodUpdated,
      );
      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);
    setFoods(foodsFiltered)
  }

  function toggleModal() {
    setModalIsOpen(!modalIsOpen)
  }

  function toggleEditModal() {
    setModalEditIsOpen(!modalEditIsOpen)
  }

  function handleEditingFood(food: FoodProps) {
    setEditingFood(food)
    toggleEditModal()
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalIsOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditingFood
        isOpen={modalEditIsOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods.map(food => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditingFood={handleEditingFood}
          />
        ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
