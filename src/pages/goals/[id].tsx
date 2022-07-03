import { useState } from 'react';
import { useForm } from 'react-hook-form';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';

const GoalViewPage: NextPageWithLayout = () => {
  const [editGoal, setEditGoal] = useState(false)

  const { register, handleSubmit, reset } = useForm();

  const id = useRouter().query.id as string;
  const goalQuery = trpc.useQuery(['goals.byGoalId', { id }]);
  const tasks = goalQuery?.data?.tasks

  if (goalQuery.error) {
    return (
      <NextError
        title={goalQuery.error.message}
        statusCode={goalQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (goalQuery.status !== 'success') {
    return <>Loading...</>;
  }

  const { data } = goalQuery;

  return (
    <div className="m-2 bg-purple-300">
      <div className="p-2 text-xl text-center">
        Goal Details
      </div>
      <div className="text-end">
        <button className="text-white bg-purple-600 btn" onClick={() => setEditGoal(!editGoal)}>
          {editGoal ? "Cancel" : "Edit"}
        </button>
      </div>
      <div className="p-4 bg-green-100">
        <div className="p-1 bg-gray-200">
          Title: {' '}
          <input
            className="w-full form-input"
            value={data.title}
            {...register("title")}
            disabled={!editGoal}
          />
        </div>
        <div className="p-1 bg-gray-200">
          Description:{' '}
          <input
            className="w-full form-input"
            value={data.description}
            {...register("description")}
            disabled={!editGoal}
          />
        </div>
        <div className="p-2 text-xl text-center bg-blue-100">
          Tasks
        </div>
        {tasks?.map((task) => (
          <div
            key={task.id}
            className="p-1 mt-3 bg-blue-300"
          >
            <div className="p-1 bg-gray-300">
              Title: {' '}
              <input
                className="w-full form-input"
                value={task.title}
                {...register("task.title")}
                disabled={!editGoal}
              />
            </div>
            <div className="p-1 bg-gray-300">
              Description: {' '}
              <input
                className="w-full form-input"
                value={task.description}
                {...register("task.description")}
                disabled={!editGoal}
              />
            </div>
            <div className="p-1 bg-gray-300">
              Cadence: {' '}
              <input
                className="w-full form-input"
                value={task.cadence}
                {...register("task.cadence")}
                disabled={!editGoal}
              />
            </div>
            <div className="p-1 bg-gray-300">
              Quantity: {' '}
              <input
                className="w-full form-input"
                value={task.quantity}
                {...register("task.quantity")}
                disabled={!editGoal}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
    // <>
    //   <h1>{data.title}</h1>
    //   <em>Created {data.createdAt.toLocaleDateString('en-us')}</em>

    //   <p>{data.description}</p>

    //   <h2>Raw data:</h2>
    //   <pre>{JSON.stringify(data, null, 4)}</pre>
    // </>
  );
};

export default GoalViewPage;
