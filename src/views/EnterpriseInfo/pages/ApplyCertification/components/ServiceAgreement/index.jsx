import React from 'react'
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './index.scss'
const ServiceAgreement = (props) => {
    return (
        <div className="service-agreement-page">
            <div className="header-box">
                <span>隐私政策</span>
                <CloseOutlined onClick={e => props.close()} style={{ fontSize: 20, color: "#999", cursor: "pointer" }} />
            </div>
            <div className="text-container">
                <div className="service-agreement-title">
                    <h1>隐私权政策</h1>
                    <span className="service-agreement-update">最近更新日期：2020年12月10日</span>
                </div>
                <div className="chapter-wrap">
                    <p>
                        陕西交建云数据科技有限公司（注册地址：陕西省西安市丈八一路C幢801室，以下简称<span className="bold-text">“我们”</span>或<span className="bold-text">“交建数科”</span>）系公路云企业助手及交建数科旗下系列产品的运营者，我们非常重视保护用户（以下简称“您”）的个人信息和隐私。在您使用公路云企业助手服务时，我们会收集、使用、保存、共享您的相关个人信息。为呈现我们处理您个人信息的情况，我们特制定本《隐私权政策》（以下简称<span className="bold-text">“隐私政策”</span>），我们承诺严格按照本隐私政策处理您的个人信息。
                    </p>
                    <p>
                        我们在此提醒您：
                    </p>
                    <p>
                        本隐私政策适用于包含公路云企业助手在内的交建数科产品及服务，包括交建数科网(域名为 roadCloud.com)及交建数科云、交建数科公众号、交建数科小程序、公路云H5 页面及客户端、交建数科智能硬件以及将交建数科部分功能/服务作为第三方服务集成在交建数科关联公司(见定义条款)和/或其他第三方智能硬件、软件或服务中。<span className="bold-text">如我们关联公司(范围详见定义部分)的产品或服务中使用了交建数科提供的产品或服务但未设独立的隐私政策的，则本隐私政策同样适用于该部分产品或服务。</span>
                    </p>
                    <p>
                        <span className="bold-text">在您使用公路云企业助手前，请您务必认真阅读本隐私政策，充分理解各条款内容，包括但不限于免除或限制我们责任的条款。您知晓并确认，当您勾选已阅读并同意本隐私政策，即表示您同意我们按照本隐私政策处理您的个人信息。</span>
                    </p>
                    <br />
                    <p>
                        <span className="bold-text">
                            本隐私政策将帮助您了解以下内容：
                        </span>
                    </p>
                    <p>
                        <span className="bold-text">
                            一、定义
                        </span>
                    </p>
                    <p>
                        <span className="bold-text">
                            二、我们如何收集和使用您的个人信息
                        </span>
                    </p>
                    <p>
                        <span className="bold-text">
                            三、我们如何使用 Cookie 和同类技术
                        </span>
                    </p>
                    <p>
                        <span className="bold-text">
                            四、我们如何保存您的个人信息
                        </span>
                    </p>
                    <p>
                        <span className="bold-text">
                            五、我们如何共享、转让、公开披露您的个人信息
                        </span>
                    </p>
                    <p>
                        <span className="bold-text">
                            六、我们如何保护您的个人信息
                        </span>
                    </p>
                    <p>
                        <span className="bold-text">
                            七、您如何管理您的个人信息
                        </span>
                    </p>
                    <p>
                        <span className="bold-text">
                            八、我们如何处理未成年人的个人信息
                        </span>
                    </p>
                    <p>
                        <span className="bold-text">
                            九、本隐私政策如何更新
                        </span>
                    </p>
                    <p>
                        <span className="bold-text">
                            十、如何联系我们
                        </span>
                    </p>
                    <br />
                    <p>
                        <h1>一、 定义</h1>
                    </p>
                    <p>
                        <span className="bold-text">
                            1、交建数科：
                        </span>指研发并提供交建数科产品和服务的陕西交建云数据科技有限公司及现在或未来设立的相关关联公司的单称或合称。
                    </p>
                    <p>
                        <span className="bold-text">
                            2、交建数科服务：
                        </span>是指由交建数科开发和服务的公路云、项目管理、目标管理、公司级管理、甲方项目管理、乙方项目管理、多方协同、等 SaaS 产品，帮助客户在新基建时代提高运营效率和盈利能力。
                    </p>
                    <p>
                        <span className="bold-text">
                            3、公路云企业助手：
                        </span>是指交建数科开发和运营的软件产品，为使用交建数科服务的商户提供包括但不限于订单实时处理、商品交易动态查询、数据统计、会员管理、券核销、客服及售后争议处理等多项服务内容。
                    </p>
                    <p>
                        <span className="bold-text">
                            4、关联公司：
                        </span>指交建数科公司年报披露的交建数科服务提供者的关联公司。
                    </p>
                    <p>
                        <span className="bold-text">
                            5、商户/用户：
                        </span>指注册公路云企业助手账号或使用公路云企业助手服务的自然人、法人或其他组织。
                    </p>
                    <p>
                        <span className="bold-text">
                            6、个人信息：
                        </span>指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。
                    </p>
                    <p>
                        <span className="bold-text">
                            7、个人敏感信息：
                        </span>指一旦泄露、非法提供或滥用可能危害人身和财产安全，极易导致个人名誉、身心健康受到损害或歧视性待遇等的个人信息。在本隐私政策中还包括：网络行踪轨迹、精确定位信息、交易记录。
                    </p>
                    <p>
                        <span className="bold-text">
                            8、个人信息删除：
                        </span>指在实现日常业务功能所涉及的系统中去除个人信息的行为，使其保持不可被检索、访问的状态。
                    </p>
                    <p>
                        <h1>二、我们如何收集和使用您的个人信息</h1>
                    </p>
                    <p>
                        在您使用我们的产品及/或服务时，我们需要/可能需要收集和使用的您的个人信息包括如下两种:
                    </p>
                    <p>
                        为实现向您提供我们产品及/或服务的基本功能，您须授权我们收集、使用的必要的信息。如您拒绝提供相应信息，您将无法正常使用我们的产品及/或服务；
                    </p>
                    <p>
                        为实现向您提供我们产品及/或服务的扩展功能，您可选择授权我们收集、使用的信息。如您拒绝提供，您将无法正常使用相关扩展功能或无法达到我们拟达到的功能效果，但并不会影响您正常使用我们产品及/或服务的基本功能。
                    </p>
                    <p>
                        <h2>（一）基本功能中我们收集和使用您个人信息的情形</h2>
                    </p>
                    <p>
                        <h3>1. 完成注册</h3>
                        为注册账号使用我们的服务，您需要提供手机号码、密码用于创建账户以完成注册。我们收集上述信息是为了帮助您完成公路云企业助手账号的注册，如您不同意提供上述信息，我们将无法为您创建账户并正常向您提供服务。对于需要通过登录账号才能使用的服务，我们可能会根据您提供的上述信息校验您的身份，确保我们是在为您本人提供服务。
                    </p>
                    <p>
                        <h3>2. 一键登录</h3>
                        当您使用手机号码一键登录公路云企业助手时，我们会通过创蓝SDK收集您的手机号码运营商、手机号码、MAC、IP地址、手机机型、系统类型、系统版本、网络环境、网关取号报错日志、IMEI、IMSI、ICCID等信息。我们收集上述信息是为了帮助您免于使用密码或手机短信验证码进行登录，以便于您快捷地完成登录，并保证您的账号安全性。
                    </p>
                    <p>
                        <h3>3. 消息推送</h3>
                        当您使用公路云企业助手时，我们会通过【个推SDK，小米push SDK， 华为push SDK， oppo push SDK，魅族push SDK，vivo push SDK等】收集您的设备识别码。我们收集上述信息是为了帮助您即时收到公路云企业助手推送的消息。如您不提供上述信息，则我们将无法正常向您提供服务。
                    </p>
                    <p>
                        <h3>4. 提供商品或服务信息展示</h3>
                        <p>
                            （1）设备信息:我们会根据您在软件安装及/或使用中的具体操作，接收并记录您所使用的设备相关信息(包括设备型号、操作系统版本、设备设置、唯一设备标识符、设备环境等软硬件特征信息)、设备所在位置相关信息(包括您授权的GPS 位置以及 WLAN 接入点、蓝牙和基站等传感器信息)。
                        </p>
                        <p>
                            （2）服务日志信息:当您使用我们的网站或客户端提供的产品或服务时，我们会自动收集您对我们服务的详细使用情况，作为服务日志保存，包括浏览、点击查看、搜索查询、收藏、售后、关注分享信息、发布信息，以及 IP 地址、浏览器类型、访问日期和时间。
                        </p>
                        <p>
                            <span className="bold-text">
                                请注意，单独的设备信息、服务日志信息是无法识别特定自然人身份的信息。
                            </span>如果我们将这类非个人信息与其他信息结合用于识别特定自然人身份，或者将其与个人信息结合使用，则在结合使用期间，这类非个人信息将被视为个人信息，除取得您授权或法律法规另有规定外， 我们会将这类信息做匿名化、去标识化处理。
                        </p>
                        <p>
                            <span className="bold-text">
                                （3）为向您提供更便捷、更符合您个性化需求的信息展示、搜索及推送服务，我们会根据您的设备信息和服务日志信息，提取您的偏好特征，并基于特征标签产出间接人群画像，用于展示、推送信息和可能的商业广告。
                            </span>如果您不想接受我们给您发送的商业广告，您可通过短信提示回复退订或我们提供的其他方 式进行退订或关闭。在您使用我们提供的站内搜索服务时，我们也同时提供了不针对您个人特征的选项。
                        </p>
                        <p>
                            <h3>5. 帮助您完成下单及订单管理</h3>
                            当您在我们的产品及/或服务中销售/订购具体商品及/或服务时，我们会通过系统为您生成销售/或服务的订单。<span className="bold-text">
                                在订单管理过程中，我们可能会申请开启您的位置信息（地理位置）、相机/摄像头、相册及存储的相关权限，用于实现商品及/或服务的识别或扫码收款和相关硬件设备的设置管理功能；在下单过程中，我们会收集收货人姓名、收货地址、收货人联系电话，
                            </span>我们收集这些信息是为了帮助您顺利实现交易、保障您的交易安全、查询订单信息、提供客服与售后服务及其他我们明确告知的目的。
                        </p>
                        <p>您可以为其他人订购商品及/或服务，您需要提供该实际订购人的前述个人信息。
                            为便于您了解查询订单信息并对订单信息进行管理，我们会收集您在使用我们服务过程中产生的订单信息用于向您展示及便于您对订单进行管理。
                        </p>
                        <p>
                            <h3>6. 客服及争议处理</h3>
                            <p>
                                当您与我们联系或提出争议纠纷处理申请时，为了保障您的账户及系统安全，<span className="bold-text">我们需要您提供手机号码、身份证信息、营业执照等以核验您的身份。</span>如您不提供上述信息，您将无法有效地联系客服或进行争议纠纷处理，但不影响您正常使用我们的服务。
                            </p>
                            <p>
                                为便于与您联系、尽快帮助您解决问题或记录相关问题的处理方案及结果，我们可能会收集您与我们的通信/通话记录、您的账号信息、订单信息、您为了证明相关事实提供的信息、您留下的联系方式信息。如您不提供上述信息，您向我们提出的问题可能无法得到及时、有效处理，但不影响您正常使用我们的服务。
                            </p>
                        </p>
                        <br />
                        <p>
                            <h2>（二）其他</h2>
                            <p>
                                <span className="bold-text">1.超出授权同意范围使用个人信息</span>
                            </p>
                            <p>
                                <span className="bold-text">若我们将个人信息用于本政策未载明的其他用途，或者将基于特定目的收集而来的个人信息用于其他目的，或者我们主动从第三方处获取您的个人信息，均会事先获得您的同意。</span>
                            </p>
                            <p>
                                <span className="bold-text">2.我们间接收集的个人信息</span>
                            </p>
                            <p>若我们从第三方处间接获取您的个人信息的，我们会在收集前明确以书面形式要求该第三方在已依法取得您同意后收集个人信息，并向您告知共享的信息内容，且涉及敏感信息的在提供给我们使用前需经过您的明确确认，要求第三方对个人信息来源的合法性和合规性作出承诺。我们会使用不低于我们对直接收集个人信息同等的保护手段与措施对间接获取的个人信息进行保护。</p>
                            <p>
                                <span className="bold-text">3.征得授权同意的例外</span>
                            </p>
                            <p>
                                <span className="bold-text">您充分理解并同意，我们在以下情况下收集、使用您的个人信息无需您的授权同意:</span>
                            </p>
                            <p>
                                <span className="bold-text">(1) 与我们履行法律法规规定的义务相关的；</span>
                            </p>
                            <p>
                                <span className="bold-text">(2) 与国家安全、国防安全有关的；</span>
                            </p>
                            <p>
                                <span className="bold-text">(3) 与公共安全、公共卫生、重大公共利益有关的；</span>
                            </p>
                            <p>
                                <span className="bold-text">(4) 与刑事侦查、起诉、审判和判决执行等司法或行政执法有关的；</span>
                            </p>
                            <p>
                                <span className="bold-text">(5) 出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的； </span>
                            </p>
                            <p>
                                <span className="bold-text">(6) 您自行向社会公众公开的个人信息；</span>
                            </p>
                            <p>
                                <span className="bold-text">(7) 从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道； </span>
                            </p>
                            <p>
                                <span className="bold-text">(8) 根据与您签订和履行相关协议或其他书面文件所必需的； </span>
                            </p>
                            <p>
                                <span className="bold-text">(9) 用于维护所提供的产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障。 </span>
                            </p>
                            <p>
                                请知悉，根据适用的法律，<span className="bold-text">若我们对个人信息采取技术措施和其他必要措施进行处理，使得数据接收方无法重新识别特定个人且不能复原，</span>或我们可能会对收集的信息进行去标识化地研究、统计分析和预测，用于改善交建数科服务的内容和布局，为商业决策提供产品或服务支撑，以及改进我们的产品和服务(包括使用匿名数据进行机器学习或模型算法训练)，<span className="bold-text">则此类处理后数据的使用无需另行向您通知并征得您的同意。</span>
                            </p>
                            <p>
                                4. 如我们停止运营交建数科网产品或服务，我们将及时停止继续收集您个人信息的活动，将停止运营的通知以逐一送达或公告的形式通知您，并对我们所持有的与已关停业务相关的个人信息进行删除或匿名化处理。
                            </p>
                        </p>
                        <br />
                        <p>
                            <h1>三、我们如何使用 Cookie 和同类技术</h1>
                            <h2>(一) Cookie</h2>
                            <p>
                                为确保网站正常运转、为您获得更轻松的访问体验、向您推荐您可能感兴趣的内容，我们会在您的计算机或移动设备上存储Cookie、Flash Cookie，或浏览器(或关联应用程序)提供的其他通常包含标识符、站点名称以及一些号码和字符的本地存储(统称“Cookie”)。借助于 Cookie，网站能够存储您的偏好等数据。
                            </p>
                            <p>
                                <span className="bold-text">如果您的浏览器或浏览器附加服务允许，您可修改对 Cookie 的接受程度或拒绝我们的Cookie。</span>
                                但如果您这么做，在某些情况下可能会影响您安全访问我们的网站，且可能需要在每一次访问我们的网站时更改用户设置。
                            </p>
                            <h2>(二) Cookie同类技术 </h2>
                            <p>
                                除 Cookie 外，我们还会在网站上使用网站信标、像素标签、ETag 等其他同类技术。
                                例如，我们向您发送的电子邮件可能含有链接至我们网站内容的地址链接，如果您点击该链接，我们则会跟踪此次点击，帮助我们了解您的产品或服务偏好，以便于我们主动改善客户服务体验。网站信标通常是一种嵌入到网站或电子邮件中的透明图像。借助于电子邮件中的像素标签，我们能够获知电子邮件是否被打开。如果您不希望自己的活动以这种方式被追踪， 则可以随时从我们的寄信名单中退订。ETag(实体标签)是在互联网浏览器与互联网服务器之间背后传送的 HTTP 协议标头，可代替 Cookie。ETag 可以帮助我们避免不必要的服务器负载，提高服务效率，节省资源、能源，同时，我们可能通过 ETag 来记录您的身份，以便我们可以更深入地了解和改善我们的产品或服务。 <span className="bold-text">大多数浏览器均为用户提供了清除浏览器缓存数据的功能，您可以在浏览器设置功能中进行相应的数据清除操作。</span>但请注意，如果停用 ETag，您可能无法享受相对更佳的产品或服务体验。
                            </p>
                        </p>
                        <br />
                        <p>
                            <h1>四、我们如何保存您的个人信息</h1>
                            <p>我们将在本隐私政策载明的目的所需及法律法规要求的最短保存期限之内，保存您的个人信息。前述期限届满后，我们将对您的个人信息做删除或匿名化处理。</p>
                            <p>我们将您的个人信息保存在中国境内。如需将您的个人信息传输至中国境外时，我们会另行征求您的同意，并遵守相关法律规定。</p>
                        </p>
                        <br />
                        <p>
                            <h1>五、我们如何共享、转让、公开披露您的个人信息</h1>
                            <h2>(一) 共享</h2>
                            <p>我们不会与交建数科服务提供者以外的公司、组织和个人共享您的个人信息，但以下情况除外:</p>
                            <h3>1.在法定情形下的共享</h3>
                            <p>我们可能会根据法律法规规定、诉讼、争议解决需要，或按行政、司法机关依法提出的要求，对外共享您的个人信息。</p>
                            <h3>2.在获取明确同意的情况下共享</h3>
                            <p>获得您的明确同意后，我们会与其他方共享您的个人信息。</p>
                            <h3>3.在您主动选择情况下共享</h3>
                            <p>通过交建数科购买服务，我们会根据您的选择，将您的订单信息中与交易有关的必要信息共享给相关服务的提供者，以实现您的交易及售后服务需求。</p>
                            <h3>4.与关联公司间共享</h3>
                            <p>
                                <span className="bold-text">为便于我们基于交建数科账户向您提供产品和服务，推荐您可能感兴趣的信息，识别会员账号异常，保护交建数科关联公司或其他用户或公众的人身财产安全免遭侵害，您的个人信息可能会与我们的关联公司和/或其指定的服务提供商共享。</span>我们只会共享必要的个人信息，且受本隐私政策中所声明目的的约束，如果我们共享您的个人敏感信息或关联 公司改变个人信息的使用及处理目的，将再次征求您的授权同意。
                            </p>
                            <h3>5.与授权合作伙伴共享</h3>
                            <p>
                                <span className="bold-text">我们可能委托授权合作伙伴为您提供某些服务或代表我们履行职能，</span>我们仅会出于本隐私政策声明的合法、正当、必要、特定、明确的目的共享您的信息，授权合作伙伴只能接触到其履行职责所需信息，且不得将此信息用于其他任何目的。
                                目前，我们的授权合作伙伴包括以下类型:
                            </p>
                            <p>
                                (1) 广告、分析服务类的授权合作伙伴。除非得到您的许可，否则我们不会将您的个人身份信息与提供广告、分析服务的合作伙伴共享。我们会委托这些合作伙伴处理与广告覆盖面和有效性相关的信息，但不会提供您的个人身份信息，或者我们将这些信息进行去标识化处理，以便它不会识别您个人。这类合作伙伴可能将上述信息与他们合法获取的其他数据相结 合，以执行我们委托的广告服务或决策建议。
                            </p>
                            <p>
                                (2) 供应商、服务提供商和其他合作伙伴。我们将信息发送给支持我们业务的供应商、服务提供商和其他合作伙伴，这些支持包括受我们委托提供的技术基础设施服务、分析我们服务的使用方式、衡量广告和服务的有效性、提供客户服务、支付便利或进行学术研究和调查。 我们会对授权合作伙伴获取有关信息的应用程序接口(API)、软件工具开发包(SDK)进行 严格的安全检测，并与授权合作伙伴约定严格的数据保护措施，令其按照我们的委托目的、服务说明、本隐私权政策以及其他任何相关的保密和安全措施来处理个人信息。
                            </p>
                            <h2>(二) 转让</h2>
                            <p>我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外:</p>
                            <p>1. 在获取明确同意的情况下转让:获得您的明确同意后，我们会向其他方转让您的个人信息；</p>
                            <p>2. 在交建数科服务提供者发生合并、收购或破产清算情形，或其他涉及合并、收购或破产清算情形时，如涉及到个人信息转让，我们会要求新的持有您个人信息的公司、组织继续受本政策的约束，否则我们将要求该公司、组织和个人重新向您征求授权同意。</p>
                            <h2>(三) 公开披露</h2>
                            <p>
                                <span className="bold-text">我们仅会在以下情况下，公开披露您的个人信息:</span>
                            </p>
                            <p>
                                1.获得您明确同意或基于您的主动选择，我们可能会公开披露您的个人信息；
                            </p>
                            <p>
                                <span className="bold-text">2. 如果我们确定您出现违反法律法规或严重违反交建数科相关协议及规则的情况，或为保护交建数科用户或公众的人身财产安全免遭侵害，我们可能依据法律法规或征得您同意的情况下披露关于您的个人信息，</span>包括相关违规行为以及交建数科已对您采取的措施。
                            </p>
                            <h2>(四) 共享、转让、公开披露个人信息时事先征得授权同意的例外</h2>
                            <p>以下情形中，共享、转让、公开披露您的个人信息无需事先征得您的授权同意:</p>
                            <p>1.与国家安全、国防安全有关的；</p>
                            <p>2.与公共安全、公共卫生、重大公共利益有关的；</p>
                            <p>3.与犯罪侦查、起诉、审判和判决执行等司法或行政执法有关的；</p>
                            <p>4.出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</p>
                            <p>5.您自行向社会公众公开的个人信息；</p>
                            <p>6.从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。
                                请知悉，根据适用的法律，<span className="bold-text">若我们对个人信息采取技术措施和其他必要措施进行处理，使得数据接收方无法重新识别特定个人且不能复原，则此类处理后数据的共享、转让、公开披露无需另行向您通知并征得您的同意。</span>
                            </p>
                        </p>
                        <br />
                        <p>
                            <h1>六、我们如何保护您的个人信息</h1>
                            <p>1.我们已采取符合业界标准、合理可行的安全防护措施保护您的信息，防止个人信息遭到未经授权访问、公开披露、使用、修改、损坏或丢失。例如，在您的浏览器与服务器之间 交换数据时受 SSL 协议加密保护;我们同时对交建数科网站提供 HTTPS 协议安全浏览方式;我 们会使用加密技术提高个人信息的安全性;我们会使用受信赖的保护机制防止个人信息遭到 恶意攻击;我们会部署访问控制机制，尽力确保只有授权人员才可访问个人信息;以及我们 会举办安全和隐私保护培训课程，加强员工对于保护个人信息重要性的认识。</p>
                            <p>2.我们有行业先进的以数据为核心、围绕数据生命周期进行的数据安全管理体系，从组织建设、制度设计、人员管理、产品技术等方面多维度提升整个系统的安全性。目前，我们的重要信息系统已经通过网络安全等级保护的三级以上测评。</p>
                            <p>3.互联网并非绝对安全的环境，使用交建数科服务时，
                                <span className="bold-text">我们强烈建议您不要使用非交建数科推荐的通信方式发送您的信息。</span>
                                您可以通过我们的服务建立联系和相互分享。当您通过我们的服 务创建交流、交易或分享时，您可以自主选择沟通、交易或分享的对象，作为能够看到您的 交易内容、联络方式、交流信息或分享内容等相关信息的第三方。
                                在使用交建数科服务进行网上交易时，您不可避免地要向交易对方或潜在的交易对方披露自己的个人信息，
                                <span className="bold-text">如联络方式或联系地址。</span>请您妥善保护自己的个人信息，仅在必要的情形下向他 人提供。如您发现自己的个人信息尤其是您的账户或密码发生泄露，请您立即联络交建数科客服，以便我们根据您的申请采取相应措施。
                                请注意，您在使用我们服务时自愿共享甚至公开分享的信息，可能会涉及您或他人的个人信息甚至个人敏感信息。请您更加谨慎地考虑，是否在使用我们的服务时共享甚至公开分享相 关信息。
                                请使用复杂密码，协助我们保证您的账号安全。我们将尽力保障您发送给我们的任何信息的 安全性。如果我们的物理、技术或管理防护设施遭到破坏，导致信息被非授权访问、公开披露、篡改或毁坏，导致您的合法权益受损，我们将承担相应的法律责任。
                            </p>
                            <p>4.在不幸发生个人信息安全事件后，我们将按照法律法规的要求向您告知:安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。事件相关情况我们将以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。同时，我们还将按照监管部门要求，上报个人信息安全事件的处置情况。</p>
                        </p>
                        <br />
                        <p>
                            <h1>七、您如何管理您的个人信息</h1>
                            <h2>（一）您对您的个人信息您享有以下权利</h2>
                            <h3>1. 您有权访问或更正您的个人信息</h3>
                            <p>如果您想行使个人信息访问权或更正权，您可以通过以下方式自行访问或更正: </p>
                            <p>（1）账户信息：如果您希望访问或更正您的账户绑定的手机号、个人资料信息、更改您的密码等，您可以通过访问交建数科网页执行此类操作。</p>
                            <p>（2）搜索信息：您可以在交建数科及相关网站访问或清除您的搜索历史记录、查看和修改兴趣以及管理其他数据。</p>
                            <h3>2. 您有权删除您的个人信息</h3>
                            <p>在以下情形中，您有权向我们提出删除您的个人信息：</p>
                            <p>（1）我们违反法律法规或与您的约定收集、使用个人信息；</p>
                            <p>（2）我们违反法律法规或与您的约定与第三方共享或转让您的个人信息，我们将立即停止共享、转让行为，并通知第三方及时删除；</p>
                            <p>（3）我们违反法律法规规定或与您的约定，公开披露您的个人信息，我们将立即停止公开披露的行为，并发布通知要求相关接收方删除相应的信息；</p>
                            <p>（4）您不再使用我们的产品或服务，或您注销了账号，或我们终止服务及运营。</p>
                            <h3>3. 您有权改变您授权同意的范围</h3>
                            <p>您可以通过删除信息、在设备本身操作系统中关闭相关功能（如存储、电话、GPS地理位置、麦克风、相机）、或在交建数科网站或软件中进行隐私设置等方式改变您授权我们继续收集个人信息的范围或撤回您的授权。您也可以通过注销账户的方式，撤回我们继续收集您个人信息的全部授权。 请您理解，每个业务功能需要一些基本的个人信息才能得以完成，当您撤回同意或授权后，我们无法继续为您提供撤回同意或授权所对应的服务，也不再处理您相应的个人信息。但您撤回同意或授权的决定，不会影响此前基于您的授权而开展的个人信息处理。</p>
                            <h3>4. 您有权注销您的账号</h3>
                            <p>您可以登录交建数科账号，点击您需要注销账号，在您确认删除您的账号信息后，我们将删除与您账户相关的个人信息。您注销上述账户的行为是不可逆的，我们将停止为您提供产品或服务，不再收集您的个人信息，您也将无法享有与上述账户相关的权益或者资产。</p>
                            <h2>（二）响应您的上述请求 </h2>
                            <p>如您无法按照上述方式行使权利的，您可以采取本隐私政策载明的联系方式与我们联系。为保障安全，您可能需要提供书面请求，或以其他方式证明您的身份。我们可能会先要求您验证自己的身份，然后再处理您的请求。
                                对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将视情况收取一定成本费用。对于那些无端重复、需要过多技术手段、给他人合法权益带来风险或者非常不切实际的请求，我们可能会予以拒绝。
                            </p>
                            <h2>（三）响应情形的例外</h2>
                            <p>在以下情形中，我们将无法响应您的请求:</p>
                            <h3>1.与我们履行法律法规规定的义务相关的;</h3>
                            <h3>2.与国家安全、国防安全直接相关的;</h3>
                            <h3>3.与公共安全、公共卫生、重大公共利益直接相关的;</h3>
                            <h3>4.与刑事侦查、起诉、审判和执行判决等直接相关的;</h3>
                            <h3>5.我们有充分证据表明个人信息主体存在主观恶意或滥用权利的;</h3>
                            <h3>6.出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的;</h3>
                            <h3>7.响应个人信息主体的请求将导致个人信息主体或其他个人、组织的合法权益受到严重损害的;</h3>
                            <h3>8.涉及商业秘密的。</h3>
                        </p>
                        <br />
                        <p>
                            <h1>八、我们如何处理未成年人的个人信息 </h1>
                            <p>
                                <span className="bold-text">在电子商务活动中我们推定您具有相应的民事行为能力。如您为未成年人，我们要求您请您的父母或监护人仔细阅读本隐私政策，并在征得您的父母或监护人同意的前提下使用我们的服务或向我们提供信息。</span>
                            </p>
                            <p>
                                对于经父母或监护人同意使用我们的产品或服务而收集未成年人个人信息的情况，我们只会在法律法规允许、父母或监护人明确同意或者保护未成年人所必要的情况下使用、共享、转让或披露此信息。
                            </p>
                        </p>
                        <br />
                        <p>
                            <h1>九、本隐私政策如何更新  </h1>
                            <p>
                                （一）我们的隐私政策可能会适时发生变更。<span className="bold-text">未经您明确同意，我们不会限制您按照本隐私政策所应享有的权利。</span>我们会在专门页面上发布对本政策所做的任何变更。
                            </p>
                            <p>
                                （二）对于重大变更，我们还会提供更为显著的通知(包括我们会通过交建数科网站公示的方式进行通知或向您提供弹窗提示)。本政策所指的重大变更包括但不限于:
                            </p>
                            <p>1.我们的服务模式发生重大变化。如处理个人信息的目的、处理的个人信息类型、个人信息的使用方式等； </p>
                            <p>2.我们在控制权等方面发生重大变化。如并购重组等引起的信息控制者变更等； </p>
                            <p>3.个人信息共享、转让或公开披露的主要对象发生变化；</p>
                            <p>4.您参与个人信息处理方面的权利及其行使方式发生重大变化；</p>
                            <p>5.我们负责处理个人信息安全的责任部门、联络方式及投诉渠道发生变化； </p>
                            <p>6.个人信息安全影响评估报告表明存在高风险。</p>
                            <p>我们还会将本隐私政策的旧版本在交建数科网站专门页面存档，供您查阅。</p>
                        </p>
                        <br />
                        <p>
                            <h1>十、如何联系我们 </h1>
                            <p>如果您对本隐私政策或个人信息保护有任何问题，您可以将您的书面疑问、意见或建议通过以下地址寄至客服部门：</p>
                            <p>
                                <span className="bold-text">公司名称：陕西交建云数据科技有限公司</span>
                            </p>
                            <p>
                                <span className="bold-text">注册地址：西安市雁塔区丈八一路汇鑫IBC-C幢C-801室</span>
                            </p>
                            <p>
                                <span className="bold-text">常用办公地址：西安市雁塔区丈八一路汇鑫IBC-C幢C</span>
                            </p>
                            <p>或您也可以通过以下电话与客服部门进行联系：</p>
                            <p>
                                <span className="bold-text">联系电话：029-85647890</span>
                            </p>
                            <p>
                                一般情况下，我们将在十五个工作日内回复。如果您对我们的回复不满意，特别是我们的个人信息处理行为损害了您的合法权益，您还可以向网信、电信、公安及工商等监管部门进行投诉或举报，<span className="bold-text">您还可以通过向被告住所地有管辖权的法院提起诉讼来寻求解决方案。</span>
                            </p>
                        </p>
                    </p>
                </div>
            </div>
            <div className="btn-box">
                <Button className="cus-btn" type="primary" onClick={e => props.close()}>确定</Button>
            </div>
        </div>
    )
}

export default ServiceAgreement