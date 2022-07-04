// import { useState } from 'react';
import { trpc } from '../../utils/trpc';
import { useForm } from 'react-hook-form';
import { useUser } from '@auth0/nextjs-auth0';
import Router from 'next/router';

type FormValues = {
  title: string,
  description: string,
  quantity: number,
  cadence: string,
  goalId: string,
  taskEntities: [],
}

export default function TaskForm() {
  const { user } = useUser();
  const id = user?.sub || "defaultUser"
  const goalsQuery = trpc.useQuery(['goals.byUserId', { createdBy: id }])
  
  const utils = trpc.useContext();
  const addGoal = trpc.useMutation('tasks.add', {
    async onSuccess() {
      await utils.invalidateQueries(['tasks.all']);
    },
  });

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      quantity: 1,
      cadence: "daily",
      goalId: "",
      taskEntities: [],
    }
  });

  // const [ showOptions, setShowOptions ] = useState(false);
  // function toggleShowOptions(e: any) {
  //   e.preventDefault();
  //   setShowOptions(!showOptions)
  // }

  const onSubmit = async (data: any) => {
    const input = data;
    input.createdBy = id
    input.active = true

    try {
      await addGoal.mutateAsync(input);
      reset();
      Router.push("/dashboard")
    } catch {
      (error: any) => console.log(error);
    }
  };

  return (
    <div className="p-2 m-1 text-center border-2 border-gray-100 rounded-md">
      <div className="p-1 mb-1 text-xl text-white bg-purple-600 border-2 rounded-md">
        Add Tasks
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block mt-4">
            <span>Choose a Goal</span>
            <select
              className="block w-full form-select"
              {...register("goalId")}
            >
              <option key="" value="">Select one...</option>
              {goalsQuery.data?.map((goal) => (
                <option key={goal.id} value={goal.id}>{goal.title}</option>
              ))}
            </select>
          </label>
          <div className="mt-4">
            <div className="mt-2">
              <input 
                className="block w-full form-input"
                placeholder="Task Title"
                {...register("title")}
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="mt-2">
              <input 
                className="block w-full form-input"
                placeholder="Task Description"
                {...register("description")}
              />
            </div>
          </div>
        </div>
        <input className="m-1 mt-4 text-white bg-purple-600 btn" type="submit" />
        {addGoal.error && (
          <p style={{ color: 'red' }}>{addGoal.error.message}</p>
        )}
      </form>
    </div>
  );
}

// saving until MVP functionaltiy is working
// as i love to complicate the simple...

{/* <div className="mt-4 text-xs text-end">
  <button
    className="p-1 text-white bg-gray-600 w-36"
    onClick={(e: any) => toggleShowOptions(e)}>
    {showOptions ? 'Hide More Options' : 'Show More Options'}
  </button>
</div>
{showOptions && (
  <>
    <label className="block mt-4">
      <select
        className="block w-full form-select"
        {...register("cadence")}
      >
        <option value="daily" id="daily">Daily</option>
        <option value="weekly" id="weekly">Weekly</option>
      </select>
    </label>
    <label className="block mt-4">
      <select
        className="block w-full form-select"
        {...register("quantity")}
      >
        <option value="1" id="1">1</option>
        <option value="2" id="2">2</option>
        <option value="3" id="3">3</option>
      </select>
    </label>
  </>
)} */}
