// 切换标签页
function switchTab(index) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach((tab, i) => {
        if (i === index) {
            tab.classList.add('active');
            contents[i].classList.add('active');
        } else {
            tab.classList.remove('active');
            contents[i].classList.remove('active');
        }
    });
}

function switchTool(index) {
    const toolBtns = document.querySelectorAll('.tool-btn');
    const toolContents = document.querySelectorAll('.tool-content');
    
    toolBtns.forEach((btn, i) => {
        if (i === index) {
            btn.classList.add('active');
            toolContents[i].classList.add('active');
        } else {
            btn.classList.remove('active');
            toolContents[i].classList.remove('active');
        }
    });
}
// </CHANGE>

// 更新利率显示和同步
function updateRateValue() {
    const rate = parseFloat(document.getElementById('rateSlider').value);
    document.getElementById('rateInput').value = rate.toFixed(2);
    document.getElementById('rateValue').textContent = rate.toFixed(2);
}

// 格式化数字
function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


// 贷款计算
function calculateLoan() {
    const principal = parseFloat(document.getElementById('principal').value);
    const months = parseInt(document.getElementById('months').value);
    // 从输入框获取利率值
    const annualRate = parseFloat(document.getElementById('rateInput').value);
    const type = document.getElementById('repaymentType').value;

    if (!principal || !months || !annualRate) {
        alert('请填写完整信息');
        return;
    }

    const monthlyRate = annualRate / 100 / 12;
    let totalInterest = 0;
    let schedule = [];

    if (type === 'equal-payment') {
        // 等额本息
        const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                                (Math.pow(1 + monthlyRate, months) - 1);
        
        let remainingPrincipal = principal;
        
        for (let i = 1; i <= months; i++) {
            const interest = remainingPrincipal * monthlyRate;
            const principalPayment = monthlyPayment - interest;
            remainingPrincipal -= principalPayment;
            totalInterest += interest;
            
            schedule.push({
                month: i,
                principal: principalPayment,
                interest: interest,
                payment: monthlyPayment
            });
        }
    } else {
        // 等额本金
        const monthlyPrincipal = principal / months;
        let remainingPrincipal = principal;
        
        for (let i = 1; i <= months; i++) {
            const interest = remainingPrincipal * monthlyRate;
            const payment = monthlyPrincipal + interest;
            remainingPrincipal -= monthlyPrincipal;
            totalInterest += interest;
            
            schedule.push({
                month: i,
                principal: monthlyPrincipal,
                interest: interest,
                payment: payment
            });
        }
    }

    displayLoanResult(principal, months, annualRate, type, totalInterest, schedule);
}

function displayLoanResult(principal, months, rate, type, totalInterest, schedule) {
    const typeName = type === 'equal-payment' ? '等额本息' : '等额本金';
    const totalPayment = principal + totalInterest;

    let html = `
        <div class="result-section">
            <h3>还款明细</h3>
            <div class="result-grid">
                <div class="result-item">
                    <div class="result-label">贷款本金</div>
                    <div class="result-value">¥${formatNumber(principal)}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">贷款期数</div>
                    <div class="result-value">${months} 月</div>
                </div>
                <div class="result-item">
                    <div class="result-label">年利率</div>
                    <div class="result-value">${rate}%</div>
                </div>
                <div class="result-item">
                    <div class="result-label">还款方式</div>
                    <div class="result-value">${typeName}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">支付利息</div>
                    <div class="result-value">¥${formatNumber(totalInterest)}</div>
                </div>
                <div class="result-item">
                    <div class="result-label">还款总额</div>
                    <div class="result-value">¥${formatNumber(totalPayment)}</div>
                </div>
            </div>

            <h3 style="margin-top: 24px;">逐月还款明细</h3>
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>期数</th>
                            <th>还款本金（元）</th>
                            <th>还款利息（元）</th>
                            <th>月还款额（元）</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    schedule.forEach(item => {
        html += `
            <tr>
                <td>${item.month}</td>
                <td>${formatNumber(item.principal)}</td>
                <td>${formatNumber(item.interest)}</td>
                <td>${formatNumber(item.payment)}</td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    const resultDiv = document.getElementById('loanResult');
    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
}

// 终值计算
function calculateFV() {
    const pv = parseFloat(document.getElementById('fv_pv').value);
    const rate = parseFloat(document.getElementById('fv_rate').value) / 100;
    const years = parseFloat(document.getElementById('fv_years').value);
    const type = document.getElementById('fv_type').value;

    let fv;
    if (type === 'simple') {
        fv = pv * (1 + rate * years);
    } else {
        fv = pv * Math.pow(1 + rate, years);
    }

    document.getElementById('fv_value').textContent = '¥' + formatNumber(fv);
    document.getElementById('fv_result').style.display = 'block';
}

// 有效年利率计算
function calculateEAR() {
    const nominalRate = parseFloat(document.getElementById('ear_rate').value) / 100;
    const freq = parseFloat(document.getElementById('ear_freq').value);

    const ear = (Math.pow(1 + nominalRate / freq, freq) - 1) * 100;

    document.getElementById('ear_value').textContent = ear.toFixed(4) + '%';
    document.getElementById('ear_result').style.display = 'block';
}

// 年金终值计算
function calculateFVA() {
    const pmt = parseFloat(document.getElementById('fva_pmt').value);
    const rate = parseFloat(document.getElementById('fva_rate').value) / 100;
    const periods = parseFloat(document.getElementById('fva_periods').value);
    const type = document.getElementById('fva_type').value;

    let fva = pmt * ((Math.pow(1 + rate, periods) - 1) / rate);
    
    if (type === 'due') {
        fva *= (1 + rate);
    }

    document.getElementById('fva_value').textContent = '¥' + formatNumber(fva);
    document.getElementById('fva_result').style.display = 'block';
}

// 年金现值计算
function calculatePVA() {
    const pmt = parseFloat(document.getElementById('pva_pmt').value);
    const rate = parseFloat(document.getElementById('pva_rate').value) / 100;
    const periods = parseFloat(document.getElementById('pva_periods').value);
    const type = document.getElementById('pva_type').value;

    let pva = pmt * ((1 - Math.pow(1 + rate, -periods)) / rate);
    
    if (type === 'due') {
        pva *= (1 + rate);
    }

    document.getElementById('pva_value').textContent = '¥' + formatNumber(pva);
    document.getElementById('pva_result').style.display = 'block';
}

// 更新利率显示和同步
function updateRateValue() {
    const rate = parseFloat(document.getElementById('rateSlider').value);
    document.getElementById('rateInput').value = rate.toFixed(2);
    document.getElementById('rateValue').textContent = rate.toFixed(2);
}

// 添加同步函数：从输入框同步到滑块
function syncRateFromInput() {
    const rate = parseFloat(document.getElementById('rateInput').value);
    if (!isNaN(rate) && rate >= 1 && rate <= 15) {
        document.getElementById('rateSlider').value = rate;
        document.getElementById('rateValue').textContent = rate.toFixed(2);
    }
}

// 格式化数字
function formatNumber(num) {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


// 贷款计算
function calculateLoan() {
    const principal = parseFloat(document.getElementById('principal').value);
    const months = parseInt(document.getElementById('months').value);
    const annualRate = parseFloat(document.getElementById('rateInput').value);
    const type = document.getElementById('repaymentType').value;

    // 验证输入
    if (isNaN(principal) || principal <= 0) {
        alert('请输入有效的贷款本金（必须为正数）');
        return;
    }
    
    if (isNaN(months) || months <= 0 || !Number.isInteger(months)) {
        alert('请输入有效的贷款期数（必须为正整数）');
        return;
    }
    
    if (isNaN(annualRate) || annualRate < 1 || annualRate > 15) {
        alert('请输入有效的年利率（必须在1%到15%之间）');
        return;
    }

    const monthlyRate = annualRate / 100 / 12;
    let totalInterest = 0;
    let schedule = [];

    if (type === 'equal-payment') {
        // 等额本息
        const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / 
                                (Math.pow(1 + monthlyRate, months) - 1);
        
        let remainingPrincipal = principal;
        
        for (let i = 1; i <= months; i++) {
            const interest = remainingPrincipal * monthlyRate;
            const principalPayment = monthlyPayment - interest;
            remainingPrincipal -= principalPayment;
            totalInterest += interest;
            
            schedule.push({
                month: i,
                principal: principalPayment,
                interest: interest,
                payment: monthlyPayment
            });
        }
    } else {
        // 等额本金
        const monthlyPrincipal = principal / months;
        let remainingPrincipal = principal;
        
        for (let i = 1; i <= months; i++) {
            const interest = remainingPrincipal * monthlyRate;
            const payment = monthlyPrincipal + interest;
            remainingPrincipal -= monthlyPrincipal;
            totalInterest += interest;
            
            schedule.push({
                month: i,
                principal: monthlyPrincipal,
                interest: interest,
                payment: payment
            });
        }
    }

    displayLoanResult(principal, months, annualRate, type, totalInterest, schedule);
}

// 终值计算
function calculateFV() {
    const pv = parseFloat(document.getElementById('fv_pv').value);
    const rate = parseFloat(document.getElementById('fv_rate').value);
    const years = parseFloat(document.getElementById('fv_years').value);
    const type = document.getElementById('fv_type').value;

    // 验证输入
    if (isNaN(pv) || pv <= 0) {
        alert('请输入有效的现值（必须为正数）');
        return;
    }
    
    if (isNaN(rate) || rate <= 0) {
        alert('请输入有效的年利率（必须为正数）');
        return;
    }
    
    if (isNaN(years) || years <= 0) {
        alert('请输入有效的期数（必须为正数）');
        return;
    }

    let fv;
    if (type === 'simple') {
        fv = pv * (1 + rate / 100 * years);
    } else {
        fv = pv * Math.pow(1 + rate / 100, years);
    }

    document.getElementById('fv_value').textContent = '¥' + formatNumber(fv);
    document.getElementById('fv_result').style.display = 'block';
}

// 有效年利率计算
function calculateEAR() {
    const nominalRate = parseFloat(document.getElementById('ear_rate').value);
    const freq = parseFloat(document.getElementById('ear_freq').value);

    // 验证输入
    if (isNaN(nominalRate) || nominalRate <= 0) {
        alert('请输入有效的名义年利率（必须为正数）');
        return;
    }
    
    if (isNaN(freq) || freq <= 0 || !Number.isInteger(freq)) {
        alert('请输入有效的每年复利次数（必须为正整数）');
        return;
    }

    const ear = (Math.pow(1 + nominalRate / 100 / freq, freq) - 1) * 100;

    document.getElementById('ear_value').textContent = ear.toFixed(4) + '%';
    document.getElementById('ear_result').style.display = 'block';
}

// 年金终值计算
function calculateFVA() {
    const pmt = parseFloat(document.getElementById('fva_pmt').value);
    const rate = parseFloat(document.getElementById('fva_rate').value);
    const periods = parseFloat(document.getElementById('fva_periods').value);
    const type = document.getElementById('fva_type').value;

    // 验证输入
    if (isNaN(pmt) || pmt <= 0) {
        alert('请输入有效的每期支付金额（必须为正数）');
        return;
    }
    
    if (isNaN(rate) || rate <= 0) {
        alert('请输入有效的期利率（必须为正数）');
        return;
    }
    
    if (isNaN(periods) || periods <= 0 || !Number.isInteger(periods)) {
        alert('请输入有效的期数（必须为正整数）');
        return;
    }

    let fva = pmt * ((Math.pow(1 + rate / 100, periods) - 1) / (rate / 100));
    
    if (type === 'due') {
        fva *= (1 + rate / 100);
    }

    document.getElementById('fva_value').textContent = '¥' + formatNumber(fva);
    document.getElementById('fva_result').style.display = 'block';
}

// 年金现值计算
function calculatePVA() {
    const pmt = parseFloat(document.getElementById('pva_pmt').value);
    const rate = parseFloat(document.getElementById('pva_rate').value);
    const periods = parseFloat(document.getElementById('pva_periods').value);
    const type = document.getElementById('pva_type').value;

    // 验证输入
    if (isNaN(pmt) || pmt <= 0) {
        alert('请输入有效的每期支付金额（必须为正数）');
        return;
    }
    
    if (isNaN(rate) || rate <= 0) {
        alert('请输入有效的期利率（必须为正数）');
        return;
    }
    
    if (isNaN(periods) || periods <= 0 || !Number.isInteger(periods)) {
        alert('请输入有效的期数（必须为正整数）');
        return;
    }

    let pva = pmt * ((1 - Math.pow(1 + rate / 100, -periods)) / (rate / 100));
    
    if (type === 'due') {
        pva *= (1 + rate / 100);
    }

    document.getElementById('pva_value').textContent = '¥' + formatNumber(pva);
    document.getElementById('pva_result').style.display = 'block';
}