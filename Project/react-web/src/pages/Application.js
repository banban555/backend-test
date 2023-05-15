import React from 'react';
import { Layout, Select, Button, Tag, Form, Input, Row, Col, Table, Tabs } from 'antd';
import styles from '../css/Application.module.css';
import { PlusOutlined } from '@ant-design/icons';
const { Option } = Select;
const { TabPane } = Tabs;
const { Header, Content } = Layout;

const columns = [
  { title: '교과목명', dataIndex: 'courseName', key: 'courseName' },
  { title: '교원명', dataIndex: 'instructorName', key: 'instructorName' },
  { title: '요일/시간', dataIndex: 'dayTime', key: 'dayTime' },
  { title: '강의실', dataIndex: 'classRoom', key: 'classRoom' },
  { title: '학수강좌번호', dataIndex: 'courseNumber', key: 'courseNumber' },
  { title: '수강정원', dataIndex: 'quota', key: 'quota' },
  { title: '신청인원', dataIndex: 'applications', key: 'applications' },
];

const Application = () => {
  const handleChange = (value) => console.log(`selected ${value}`);
  const onChange = (key) => console.log(`tab changed to ${key}`);

  return (
    <Layout>
      <Header className={styles.header}>
        <img src="logo.png" alt="logo" />
      </Header>

      <Layout>
        <Content className={styles.contentStyle}>
          <h1 className={styles.title}>희망강의신청</h1>
          <div className={styles.formBackground}>
            <h3 className={styles.smallTitle}>학생정보</h3>
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={4}><Form.Item label="학번"><Input /></Form.Item></Col>
                  <Col span={4}><Form.Item label="성명"><Input /></Form.Item></Col>
                  <Col span={4}><Form.Item label="소속"><Input /></Form.Item></Col>
                  <Col span={4}><Form.Item label="학년/가진급학년"><Input /></Form.Item></Col>
                  <Col span={4}><Form.Item label="강의년도"><Input /></Form.Item></Col>
                  <Col span={4}><Form.Item label="강의학기"><Input /></Form.Item></Col>
                </Row>
              </Form>
          </div>

           {/* 검색 부분 */}
            <div className={styles.formBackground}>
              <h3 className={styles.smallTitle}>강의 검색</h3>
              <Form layout="vertical">
                <Row gutter={16}>
                  <Col span={4}>
                    <Form.Item>
                      <Select defaultValue="전공" onChange={handleChange}>
                        <Option value="consturction">건설공학과</Option>
                        <Option value="education">교육학과</Option>
                        <Option value="statistic">통계학과</Option>
                        <Option value="software">융합소프트웨어</Option>
                        <Option value="data">데이터사이언스</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={4}>
                    <Form.Item>
                      <Button type="primary" className={styles.queryButton}>
                        조회
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>

          {/* 강의 신청 부분 */}
          <div className={styles.gutter16}>
            <div className={styles.flexWrapper}>
              <div className={styles.contentWrapper}>
                <h3 className={styles.smallTitle}>종합강의시간표목록</h3>
                <Table dataSource={[]} columns={columns} />
              </div>

              {/* 플러스 버튼 추가 */}
              <div className={styles.plusButtonWrapper}>
                <Button className='registerButton' type="primary" shape="circle" icon={<PlusOutlined />} />
              </div>

              <div className={styles.contentWrapper}>
                <Tabs onChange={onChange} type="card">
                  <TabPane tab="테이블뷰" key="1">희망강의 수강신청 확인 뷰 1</TabPane>
                  <TabPane tab="시간표뷰" key="2">희망강의 수강신청 확인 뷰 2</TabPane>
                </Tabs>
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Application;