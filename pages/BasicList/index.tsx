import { Table, Pagination, Card, Row, Col, Space } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import styles from "./index.less";
import { useRequest } from "umi";
import { useState, useEffect } from "react";
import { GetListUrl, BaseUrl, MustUrl } from "./constant";
import columnBuilder from "./builder/ColumnBuilder";
import Modal from "./component/Modal";
import actionBuilder from "./builder/ActionBuilder";

function BasicList() {
	//使用state hook 在state中存入两个参数page，per_page
	const [page, setPage] = useState(1);
	const [per_page, setPer_page] = useState(10);
	const [sortQuery, setSortQuery] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [modalUri, setModalUri] = useState("");
	//发送网络请求，获取数据内容
	const init = useRequest<{ data: BasicListApi.ListData }>(
		`${GetListUrl}&page=${page}&per_page=${per_page}${sortQuery}`,
		{
			manual: true,
		}
	);

	//异步hook，监听page和per_page的修改,当然还有组件挂载完成后
	useEffect(() => {
		init.run();
	}, [page, per_page, sortQuery]); //eslint-disable-line

	//获取到后端返回的dataSource 和 loading 和 columns
	const dataSource = init?.data?.dataSource;
	const loading = init.loading;
	const columns = init?.data?.layout?.tableColumn || [];

	//按钮点击时做的操作    edit  /api/admins/:id
	const actionHandler = (action: BasicListApi.Action) => {
		switch (action.action) {
			case "modal":
				const id = action.record ? action.record.id : "";
				if (action.uri !== undefined) {
					const uri =
						action.text === "Edit"
							? action.uri.replace(":id", id)
							: action.uri;
					setModalUri(BaseUrl + uri + MustUrl);
					setModalVisible(true);
				}
				break;
			case "reload":
				init.run();
				break;
			default:
				break;
		}
	};

	//子组件（Table前的）
	const BeforeTableLayout = () => {
		return (
			<Row>
				<Col xs={24} sm={12}>
					<span>基础列表</span>
				</Col>
				<Col xs={24} sm={12} className={styles.tableToolbar}>
					<Space>
						{actionBuilder(
							init?.data?.layout?.tableToolBar || [],
							actionHandler,
							false
						)}
					</Space>
				</Col>
			</Row>
		);
	};

	//子组件（Table后的）
	const AfterTableLayout = () => {
		return (
			<Row>
				<Col xs={24} sm={24} className={styles.tablePagination}>
					<Pagination
						total={init.data?.meta.total || 0}
						current={init.data?.meta.page || 1}
						pageSize={init.data?.meta.per_page || 10}
						showSizeChanger
						showQuickJumper
						showTotal={(total) => `Total ${total} items`}
						//这里变量命名在前面加个下划线
						onChange={(_page, _pageSize) => {
							//这里useState是一个异步函数，也就是说state的修改时异步的
							setPage(_page);
							setPer_page(_pageSize);
						}}
					/>
				</Col>
			</Row>
		);
	};
	//BasicList组件内容
	return (
		<PageContainer>
			<Card>
				<BeforeTableLayout />
				<Table
					loading={loading}
					dataSource={dataSource}
					columns={columnBuilder(columns, actionHandler)} //因为concat必须传入一个数组（且不能为undefined）如果columus如何为undefined的话就传入空数组
					pagination={false}
					rowKey={"id"}
					onChange={({}, {}, sorter: any) => {
						if (sorter.order) {
							const order = sorter.order.split("end").join("");
							setSortQuery(
								`&order=${order}&sort=${sorter.field}`
							);
						} else {
							setSortQuery("");
						}
					}}
				/>
				<AfterTableLayout />
			</Card>
			<Modal
				modalVisible={modalVisible}
				setModalVisibleFalse={(reload = false) => {
					setModalVisible(false);
					if (reload) {
						init.run();
					}
				}}
				modalUri={modalUri}
			/>
		</PageContainer>
	);
}

export default BasicList;
