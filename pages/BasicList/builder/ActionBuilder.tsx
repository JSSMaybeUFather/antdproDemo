import { Button } from 'antd';
import type { ButtonType } from 'antd/lib/button';

//component: "button", text: "Edit", type: "primary", action: "modal", uri: "/api/admins/:id"

const  actionBuilder = (
    actions: BasicListApi.Action[],
    actionHandler: BasicListApi.ActionHandler,
    loading: boolean,
    record: any = undefined,
) => {
    return actions.map((action: BasicListApi.Action) => {
        switch (action.component) {
            case 'button':
                return (
                    <Button
                        type={action.type as ButtonType}
                        key={action.text}
                        onClick={() => {
                            action.record = record;
                            actionHandler(action);
                        }}
                        loading={loading}
                    >
                        {action.text}
                    </Button>
                );
            default:
                return <Button key={action.text}>hello baby</Button>;
        }
    });
};
export default actionBuilder;
