import { useState } from 'react';
import { useForm } from 'react-hook-form';
import NextError from 'next/error';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';

const GoalViewPage: NextPageWithLayout = () => {
  const [editGoal, setEditGoal] = useState(false)

  const {
    register,
    // handleSubmit,
    // reset,
  } = useForm();

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
    <div className="m-2">
      <div className="p-2 m-2 font-serif text-4xl tracking-wider text-center text-white border-b-4 border-b-purple-900">
        Goal Details
      </div>
      <div className="text-end">
        <button className="text-white bg-purple-600 btn" onClick={() => setEditGoal(!editGoal)}>
          {editGoal ? "Cancel" : "Edit"}
        </button>
      </div>
      <div className="text-2xl text-center">
        <div className="m-2 text-white">
          Title
        <input
          className="w-full mt-2 form-input"
          value={data.title}
          {...register("title")}
          disabled={!editGoal}
        />
        </div>
        <div className="m-2 text-white">
          Description
          <input
            className="w-full mt-2 mb-4 form-input"
            value={data.description}
            {...register("description")}
            disabled={!editGoal}
          />
        </div>
        <div className="p-2 mt-4 text-3xl text-center text-white border-4 border-purple-600">
          Tasks
        </div>
        {tasks?.map((task) => (
          <div
            key={task.id}
            className="p-1 mt-3 text-2xl text-center text-white"
          >
            <div className="p-2">
              Title
              <input
                className="w-full form-input"
                value={task.title}
                {...register("task.title")}
                disabled={!editGoal}
              />
            </div>
            <div className="p-2">
              Description
              <input
                className="w-full form-input"
                value={task.description}
                {...register("task.description")}
                disabled={!editGoal}
              />
            </div>
            <div className="p-2">
              Cadence
              <input
                className="w-full form-input"
                value={task.cadence}
                {...register("task.cadence")}
                disabled={!editGoal}
              />
            </div>
            <div className="p-2">
              Quantity
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
