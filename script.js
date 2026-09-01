window.abrirAprovarCompras = async () => {

  esconderTudo();

  const container = document.getElementById("adminView");
  container.innerHTML = `
  <h2>Aprovação de Compras</h2>

  <p>
    Gerencie e aprove solicitações de compra.
  </p>

  <div id="cardsCompras"></div>

  <div id="comprasEmergenciais"></div>

  <div id="comprasNormais"></div>
`;
  container.classList.remove("hidden");

  // ✅ PEGA contador corretamente
  const contador = document.querySelector("#adminView p");
  if (contador) contador.style.display = "none";

  const btnExcel = document.getElementById("btnExportarExcel");
  if (btnExcel) btnExcel.style.display = "none";

  const tabela = document.getElementById("tabelaTecnicos");
  if (tabela) tabela.style.display = "none";

  // 🔥 remove tabelas antigas de compras
  container.querySelectorAll("table").forEach(t => {
    if (t.id !== "tabelaTecnicos") t.remove();
  });

  /*const table = document.createElement("table");

table.innerHTML = `
  <thead>
    <th>Técnico</th>
    <th>Ferramenta</th>
    <th>Motivo</th>
    <th>Status</th>
    <th>Ações</th>
    <th>Tipo</th>
  </thead>
    <tbody id="tbodyCompras"></tbody>
  `;

  const wrapper = document.createElement("div");
wrapper.className = "tabela-wrapper";

wrapper.appendChild(table);
container.appendChild(wrapper);

  const tbody = document.getElementById("tbodyCompras");
  console.log(tbody);*/

  const compras = await getDocs(collection(db, "compras"));

  let totalPendentes = 0;
  let totalEmergenciais = 0;
  let totalAprovadas = 0;
  let totalReprovadas = 0;

  const comprasEmergenciais = [];
  const comprasNormais = [];
  compras.forEach(docSnap => {

    const data = docSnap.data();
    
    if (data.status === "pendente") {
      totalPendentes++;
    }

    if (data.tipo === "emergencial") {
      totalEmergenciais++;
    }

    if (data.status === "aprovado") {
      totalAprovadas++;
    }

    if (data.status === "reprovado") {
      totalReprovadas++;
    }
    if (data.tipo === "emergencial") {
      comprasEmergenciais.push({
        id: docSnap.id,
        ...data
      });

    } else {
      comprasNormais.push({
        id: docSnap.id,
        ...data
      });
    }
    if (
      String(data.gestorUid).trim() !==
      String(window.usuarioLogadoUID).trim()
    ) {
      return;
    }

    /* const statusTexto = {
        pendente: "Pendente",
        em_espera: "Em espera",
        aprovado: "Aprovado",
        reprovado: "Reprovado"
      };

 const tr = document.createElement("tr");

tr.innerHTML = `
  <td>${data.tecnicoNome}</td>

  <td>${data.ferramenta}</td>

<td>

  ${data.motivo}

  ${
    data.tipo === "emergencial"
      ? `
        <br><br>

        <button class="btn-visualizar"onclick="abrirDetalhesEmergencia('${docSnap.id}')">
          Ver detalhes
        </button>
      `
      : ""
  }
</td>

  <td style="text-align:center;">

    <strong>
      ${statusTexto[data.status] || data.status}
    </strong>


      ${
        data.status === "aprovado" &&
        data.tipo !== "emergencial"
          ? `
            <strong>Prazo:</strong>
            ${
              data.prazo
                ? new Date(data.prazo)
                    .toLocaleDateString("pt-BR")
                : "-"
            }

            <br><br>

            <strong>Local:</strong>
            <br>

            ${data.localRetirada || "-"}
          `
          : ""
      }

    ${
      data.status === "em espera" &&
      data.comentarioGestor
        ? `
        <br><br>

        <small style="color:#666;">
          ${data.comentarioGestor}
        </small>
        `
        : ""
    }

  </td>

  <td>

    ${data.status === "pendente" ? `
      <button
        class="btn-aprovar"
        onclick="abrirAprovacaoComPrazo('${docSnap.id}')">
        Aprovar
      </button>

      <button
        class="btn-emespera"
        onclick="colocarEmEspera('${docSnap.id}')">
        Em espera
      </button>

      <button
        class="btn-reprovar"
        onclick="reprovarCompra('${docSnap.id}')">
        Reprovar
      </button>
    ` : ""}

    ${data.status === "em espera" ? `
      <button
        class="btn-aprovar"
        onclick="abrirAprovacaoComPrazo('${docSnap.id}')">
        Aprovar
      </button>

      <button
        class="btn-editar"
        onclick="editarComentarioEspera('${docSnap.id}')">
        Editar
      </button>

      <button
        class="btn-reprovar"
        onclick="reprovarCompra('${docSnap.id}')">
        Reprovar
      </button>
    ` : ""}

      <td>
        ${
      data.tipo === "emergencial"
      ? "🚨 Emergencial"
      : "✅ Normal"
         }
        </td>
`;
    tbody.appendChild(tr);*/
  });

  document.getElementById("cardsCompras").innerHTML = `

<div class="cards-compras">

<div class="card-indicador pendente">

  <div class="card-topo">

    <span class="card-icone pendente-icon">
      <i class="fi fi-rr-clock-three"></i>
    </span>

    <h3>${totalPendentes}</h3>

  </div>

  <span>Pendentes</span>

</div>

<div class="card-indicador emergencia">

  <div class="card-topo">

    <span class="card-icone emergencia-icon">
      <i class="fi fi-br-diamond-exclamation"></i>
    </span>

    <h3>${totalEmergenciais}</h3>

  </div>

  <span>Emergenciais</span>

</div>

<div class="card-indicador aprovado">

  <div class="card-topo">
    <span class="card-icone aprovado-icon">
      <i class="fi fi-br-check"></i>
    </span>

    <h3>${totalAprovadas}</h3>

  </div>

  <span>Aprovadas</span>

</div>

<div class="card-indicador reprovado">

<div class="card-topo">
<span class="card-icone reprovado-icon">
 <i class="fi fi-br-circle-x"></i>
 </span>

    <h3>${totalReprovadas}</h3>

  </div>

  <span>Reprovadas</span>

</div>

</div>
`;
document.getElementById("comprasEmergenciais").innerHTML = `
<div class="titulo-emergencial">

    <span>
      ⚠ COMPRAS EMERGENCIAIS
    </span>

    <span class="badge-titulo">
      ${comprasEmergenciais.length} solicitação
    </span>

</div>
`;

document.getElementById("comprasNormais").innerHTML = `
<div class="titulo-normal">

    <span>
      ✅ COMPRAS NORMAIS
    </span>

    <span class="badge-titulo">
      ${comprasNormais.length} solicitação
    </span>

</div>
`;
document.getElementById("comprasEmergenciais").innerHTML +=
  gerarTabelaCompras(
    comprasEmergenciais
  );

document.getElementById("comprasNormais").innerHTML +=
  gerarTabelaCompras(
    comprasNormais
  );

};

function gerarTabelaCompras(lista) {

  let html = `
    <div class="tabela-wrapper">

      <table>

        <thead>
          <tr>
            <th>Técnico</th>
            <th>Ferramenta</th>
            <th>Motivo</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
  `;

  lista.forEach(compra => {

    html += `
      <tr>

        <td>
          ${compra.tecnicoNome}
        </td>

        <td>
          ${compra.ferramenta}
        </td>

        <td>
          ${compra.motivo}
        </td>   
      <td>
         <span class="status-badge status-${compra.status}">
          ${compra.status}
          </span>
              </td>
              <td>
          ${compra.status === "pendente" ? `

            <button
              class="btn-aprovar"
              onclick="abrirAprovacaoComPrazo('${compra.id}')"
            >
              Aprovar
            </button>

            <button
              class="btn-emespera"
              onclick="colocarEmEspera('${compra.id}')"
            >
              Em Espera
            </button>

            <button
              class="btn-reprovar"
              onclick="reprovarCompra('${compra.id}')"
            >
              Reprovar
            </button>

          ` : ""}

          ${compra.status === "em espera" ? `

            <button class="btn-aprovar"onclick="abrirAprovacaoComPrazo('${compra.id}')">
              Aprovar
            </button>

            <button class="btn-editar"onclick="editarComentarioEspera('${compra.id}')">
              Editar
            </button>

            <button class="btn-reprovar"onclick="reprovarCompra('${compra.id}')">
              Reprovar
            </button>

          ` : ""}
          ${compra.tipo === "emergencial" ? `
           <button class="btn-visualizar"onclick="abrirDetalhesEmergencia('${compra.id}')">
              Detalhes
          </button>

` : ""}


          </td>
      </tr>
    `;
  });

  html += `
        </tbody>

      </table>

    </div>
  `;

  return html;
}

window.editarComentarioEspera = async (id) => {

  const snap =
    await getDoc(
      doc(db, "compras", id)
    );

  if (!snap.exists()) {
    return;
  }

  const data = snap.data();

  const novoComentario =
    prompt(
      "Editar comentário:",
      data.comentarioGestor || ""
    );

  if (
    novoComentario === null
  ) {
    return;
  }

  await setDoc(
    doc(db, "compras", id),
    {
      comentarioGestor:
        novoComentario
    },
    {
      merge: true
    }
  );

  alert(
    "✅ Comentário atualizado!"
  );

  abrirAprovarCompras();
};

window.aprovarCompra = async (id) => {

  const snap = await getDoc(doc(db, "compras", id));
  const data = snap.data();

  if (data.tipo !== "manual") return;

  const prazo = document.getElementById(`prazo_${id}`).value;
  const local = document.getElementById(`local_${id}`).value;

  await setDoc(
    doc(db, "compras", id),
    {
      status: "aprovado",
      comentarioGestor: "Compra aprovada.",
      prazo,
      localRetirada: local
    },
    { merge: true }
  );

  alert("✅ Compra aprovada!");
};

window.reprovarCompra = async (id) => {

  await setDoc(
    doc(db, "compras", id),
    {
      status: "reprovado",
      comentarioGestor: "Compra reprovada."
    },
    { merge: true }
  );

  alert("❌ Compra reprovada!");
      abrirAprovarCompras();
};


window.retirar = async (id) => {

  await setDoc(
    doc(db, "compras", id),
    {
      status: "retirado"
    },
    { merge: true }
  );

  alert("📦 Retirada confirmada!");


const compras = await getDocs(collection(db, "compras"));

let pendentes = 0;
let aprovadas = 0;
let reprovadas = 0;

compras.forEach(doc => {
  const s = doc.data().status;

  if (s === "pendente") pendentes++;
  if (s === "aprovado") aprovadas++;
  if (s === "reprovado") reprovadas++;
});
};
window.confirmarAprovacao = async (id) => {

  const local = document.getElementById(`local_${id}`).value;

  await setDoc(
    doc(db, "compras", id),
    {
      status: "aprovado",
      localRetirada: local
    },
    { merge: true }
  );

  // ✅ FECHA O MODAL
  const modal = document.getElementById("modalAprovacao");
  if (modal) modal.remove();

  alert("✅ Aprovado com local definido");

  abrirAprovarCompras(); // atualiza tabela
};

window.abrirSelecaoLocal = (id) => {

  const modal = document.createElement("div");
  modal.id = "modalAprovacao";
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">
      <h3>Selecionar local de retirada</h3>

      <select id="local_${id}">
        ${locaisRetirada.map(l => `<option>${l}</option>`).join("")}
      </select>

      <button onclick="confirmarAprovacao('${id}')"> Confirmar</button>
    </div>
  `;

  document.body.appendChild(modal);
};

window.toggleGestor = () => {

  const perfil = document.getElementById("regRole")?.value;
  const selectGestor = document.getElementById("regGestor");
  const blocoUnidade =document.getElementById( "blocoUnidade");


  if (!selectGestor) return;

  const label = selectGestor.previousElementSibling;

  if (perfil === "admin") {
    selectGestor.style.display = "none";
    if (label) label.style.display = "none";
    if (blocoUnidade) {blocoUnidade.style.display = "block";}
  } else {
    selectGestor.style.display = "block";
    if (label) label.style.display = "block";
    if (blocoUnidade) {blocoUnidade.style.display ="none";}
  }
};

window.toggleEmergencia = () => {

  const tipo =
    document.getElementById(
      "compTipo"
    )?.value;

 const campo =
  document.getElementById(
    "blocoEmergencia"
  );

  if (!campo) return;

  if (tipo === "emergencial") {
    campo.classList.remove("hidden");
  } else {
    campo.classList.add("hidden");
  }

};

window.colocarEmEspera = async (id) => {

  const comentario =
    prompt(
      "Digite o motivo da espera:"
    );

  if (!comentario) {
    return;
  }

  await setDoc(
    doc(db, "compras", id),
    {
      status: "em espera",

      comentarioGestor:
        comentario
    },
    { merge: true }
  );

  alert("⏳ Compra em espera");

  abrirAprovarCompras();
};

window.abrirAprovacaoComPrazo = async (id) => {
  
  const modal = document.createElement("div");
  modal.id = "modalAprovacao";
  modal.className = "modal";

  const compra =
  await getDoc(
    doc(db, "compras", id), 
  );
const dados = compra.data();
  modal.innerHTML = `
      <div class="modal-content" style="position:relative;">

        <span
          onclick="document.getElementById('modalAprovacao')?.remove()"
          style="
            position:absolute;
            top:10px;
            right:15px;
            cursor:pointer;
            color:red;
            font-size:20px;
            font-weight:bold;
          ">
          ×
        </span>
        <h3>Aprovar compra</h3>
${
  dados.tipo === "emergencial"
    ? `

      <label>
        Data da autorização:
      </label>

      <input
        type="date"
        id="dataEmergencia_${id}"
      />

      <label>
        Revenda onde ocorreu o atendimento:
      </label>

      <input
        type="text"
        id="revenda_${id}"
        placeholder="Nome da revenda"
      />

      <label>
        Observação do gestor:
      </label>

      <textarea
        id="obsGestor_${id}"
        rows="4"
        style="
          width:100%;
          box-sizing:border-box;
          resize:vertical;
          margin-bottom:10px;
        "
        placeholder="Descreva por que a compra emergencial foi autorizada."
      ></textarea>
    `
    : `
      <label>Prazo:</label>

      <input
        type="date"
        id="prazo_${id}"
      />

      <label>Local de retirada:</label>

      <select id="local_${id}">
        ${locaisRetirada.map(l =>
          `<option>${l}</option>`
        ).join("")}
      </select>

    `
}
      ${
          dados.tipo === "emergencial"
            ? `
              <label>
                Print da conversa WhatsApp:
              </label>

              <input
                type="file"
                id="printWhatsapp"
                accept="image/*"
              />

              <br><br>

              <label>
                Nota fiscal:
              </label>

              <input
                type="file"
                id="notaFiscal"
                accept=".pdf,image/*"
              />
            `
            : ""
        }
      <button onclick="confirmarAprovacaoComPrazo('${id}')">Confirmar</button>
    </div>
  `;

  document.body.appendChild(modal);
};
window.confirmarAprovacaoComPrazo = async (id) => {

  const prazo = document.getElementById(`prazo_${id}`)?.value || "";
  const local = document.getElementById(`local_${id}`)?.value || "";
  const printWhatsapp = document.getElementById("printWhatsapp")?.files[0];
  const notaFiscal = document.getElementById("notaFiscal")?.files[0];
  const dataEmergencia =document.getElementById(`dataEmergencia_${id}`)?.value || "";
  const revenda =document.getElementById(`revenda_${id}`)?.value || "";
  const obsGestor = document.getElementById(`obsGestor_${id}`)?.value || "";

  console.log("Print:", printWhatsapp);
  console.log("Nota:", notaFiscal);
  if (!prazo && !dataEmergencia
) {
  alert(
    "Preencha a data."
  );
  return;
}
let urlWhatsapp = "";
let urlNota = "";
if (printWhatsapp) {

  const urls =
    await uploadFotosChecklist(
      window.usuarioLogadoUID,
      "whatsapp",
      [printWhatsapp]
    );

  urlWhatsapp = urls[0] || "";
}

if (notaFiscal) {

  const urls =
    await uploadFotosChecklist(
      window.usuarioLogadoUID,
      "nota",
      [notaFiscal]
    );

  urlNota = urls[0] || "";
}
  await setDoc(
  doc(db, "compras", id),
  {
    status: "aprovado",

    dataEmergencia,
    revenda,
    obsGestor,

    urlWhatsapp,
    urlNota,

    prazo,
    localRetirada: local

  },
  { merge: true }
);


  const snap = await getDoc(doc(db, "compras", id));
  const data = snap.data();

  document.getElementById("modalAprovacao")?.remove();

  alert("✅ Compra aprovada com prazo");

  abrirAprovarCompras();
};

window.abrirEstatisticas = async () => {
  esconderTudo();
  const view = document.getElementById("estatisticasView");
  view.classList.remove("hidden");

  const tipoAtual = document.querySelector("#estatisticasView select:nth-of-type(1)")?.value || "tecnicos";
  const contador = document.querySelector("#adminView p");

    if (contador) {
      contador.style.display = "none";
    }

  window.trocarGrafico(tipoAtual);
  await carregarEstatisticas();
};
async function carregarEstatisticas() {

  const tipoAtual = document.querySelector("#estatisticasView select:nth-of-type(1)").value;
  const mesFiltro = window.filtros[tipoAtual];

  const usersSnap = await getDocs(collection(db, "users"));
  const checklistsSnap = await getDocs(collection(db, "checklists"));
  const comprasSnap = await getDocs(collection(db, "compras"));

  // ✅ limpa gráficos antigos
  Object.values(window.graficos || {}).forEach(g => g.destroy());
  window.graficos = {};

  // =========================
  // 🔵 TECNICOS
  // =========================
if (tipoAtual === "tecnicos") {

  let ok = 0;
  let problemas = 0;
  let pendentes = 0;

  let encontrouDados = false;

  const tecnicos = [];

  usersSnap.forEach(user => {

    const data = user.data();

    if (data.perfil === "tecnico") {
      tecnicos.push(user.id);
    }

  });

  // ==========================
  // FILTRO DE UM MÊS
  // ==========================
  if (mesFiltro && mesFiltro !== "todos") {

    const enviaram = new Set();

    checklistsSnap.forEach(doc => {

      const d = doc.data();

      if (d.mesAno !== mesFiltro)
        return;

      encontrouDados = true;

      enviaram.add(d.uid);

      const lista = d.checklist || [];

      const temProblema = lista.some(item =>
        !item.boasCondicoes ||
        item.precisaReposicao ||
        !item.estaComTecnico
      );

      if (temProblema) {
        problemas++;
      } else {
        ok++;
      }

    });

    tecnicos.forEach(uid => {

      if (!enviaram.has(uid)) {
        pendentes++;
      }

    });

  }

  // ==========================
  // TODOS OS MESES
  // ==========================
  else {

    encontrouDados = true;

    const meses = new Set();

    checklistsSnap.forEach(doc => {

      const d = doc.data();

      if (d.mesAno) {
        meses.add(d.mesAno);
      }

    });

    meses.forEach(mes => {

      const enviaram = new Set();

      checklistsSnap.forEach(doc => {

        const d = doc.data();

        if (d.mesAno !== mes)
          return;

        enviaram.add(d.uid);

        const lista = d.checklist || [];

        const temProblema = lista.some(item =>
          !item.boasCondicoes ||
          item.precisaReposicao ||
          !item.estaComTecnico
        );

        if (temProblema) {
          problemas++;
        } else {
          ok++;
        }

      });

      tecnicos.forEach(uid => {

        if (!enviaram.has(uid)) {
          pendentes++;
        }

      });

    });

  }

  const canvas =
    document.getElementById("graficoTecnicos");

  if (
    mesFiltro &&
    mesFiltro !== "todos" &&
    !encontrouDados
  ) {

    if (window.graficos?.graficoTecnicos) {
      window.graficos.graficoTecnicos.destroy();
      delete window.graficos.graficoTecnicos;
    }

    canvas.style.display = "none";

    alert(
      "⚠️ Não existem dados para o período selecionado."
    );

    return;
  }

  canvas.style.display = "block";

  gerarGrafico(
    "graficoTecnicos",
    ["OK", "Problemas", "Pendentes"],
    [ok, problemas, pendentes]
  );

}

  // =========================
  // 🟠 COMPRAS
  // =========================
if (tipoAtual === "compras") {

  let pend = 0;
  let aprov = 0;
  let reprov = 0;

  let encontrouDados = false;

  comprasSnap.forEach(doc => {

    const d = doc.data();

    const gestorCompra =
      String(d.gestorUid || "")
        .replace(/'/g, "")
        .trim();

    const gestorLogado =
      String(window.usuarioLogadoUID || "")
        .trim();

    if (gestorCompra !== gestorLogado)
      return;

    // ==========================
    // FILTRO DE MÊS
    // ==========================
    if (
      mesFiltro &&
      mesFiltro !== "todos"
    ) {

      let mesDoc = null;

      if (d.prazo) {

        const data =
          new Date(d.prazo);

        mesDoc =
          `${data.getMonth() + 1}-${data.getFullYear()}`;

      } else if (d.criadoEm) {

        const data =
          d.criadoEm.toDate
            ? d.criadoEm.toDate()
            : new Date(d.criadoEm);

        mesDoc =
          `${data.getMonth() + 1}-${data.getFullYear()}`;
      }

      if (mesDoc !== mesFiltro) {
        return;
      }
    }

    encontrouDados = true;

    switch (d.status) {

      case "pendente":
      case "em espera":
        pend++;
        break;

      case "aprovado":
        aprov++;
        break;

      case "reprovado":
        reprov++;
        break;
    }

  });

  const canvas =
    document.getElementById("graficoCompras");

  // REMOVE GRAFICO ANTERIOR
  if (window.graficos?.graficoCompras) {
    window.graficos.graficoCompras.destroy();
    delete window.graficos.graficoCompras;
  }

  if (
    mesFiltro &&
    mesFiltro !== "todos" &&
    !encontrouDados
  ) {

    canvas.style.display = "none";

    alert(
      "⚠️ Não existem compras para o período selecionado."
    );

    return;
  }

  canvas.style.display = "block";

  gerarGrafico(
    "graficoCompras",
    ["Pendentes", "Aprovadas", "Reprovadas"],
    [pend, aprov, reprov],
    ["#187ed1", "#03b32c", "#d5061a"]
  );
}

  // =========================
  // 🟡 PROBLEMAS
  // =========================
  if (tipoAtual === "problemas") {

    const contagem = {};

    checklistsSnap.forEach(doc => {

      const d = doc.data();
      // ✅ ignora filtro de mês se for "todos"
      if (mesFiltro && mesFiltro !== "todos" && d.mesAno !== mesFiltro) return;

      (d.checklist || []).forEach(i => {

        const problema =
          !i.boasCondicoes || i.precisaReposicao || !i.estaComTecnico;

        if (!problema) return;

        contagem[i.ferramenta] = (contagem[i.ferramenta] || 0) + 1;
      });
    });

    const lista = Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);


    const labels = lista.map(i => i[0]);
    const dados = lista.map(i => i[1]);

    const cores = labels.map(f => {
      const grupo = pegarGrupoFerramenta(f);
      return coresGrupos[grupo] || "#999";
    });
    
    if (lista.length === 0) {

  const canvas =
    document.getElementById(
      "graficoFerramentasProblema"
    );

  if (window.graficos?.graficoFerramentasProblema) {

    window.graficos[
      "graficoFerramentasProblema"
    ].destroy();

    delete window.graficos[
      "graficoFerramentasProblema"
    ];
  }

  canvas.style.display = "none";

  alert(
    "⚠️ Não existem problemas para o período selecionado."
  );

  return;
}

document.getElementById(
  "graficoFerramentasProblema"
).style.display = "block";

    gerarGrafico(
      "graficoFerramentasProblema",
      labels,
      dados,
      cores // ✅ agora manda cor correta
    );
  }

  // =========================
  // 🟣 RANKING
  // =========================
  if (tipoAtual === "ranking") {

    const ranking = [];

    usersSnap.forEach(user => {

      const data = user.data();
      if (data.perfil !== "tecnico") return;

      let pontos = 0;

      checklistsSnap.forEach(chk => {

        const d = chk.data();

        if (d.uid !== user.id) return;
        // ✅ ignora filtro de mês se for "todos"
        if (mesFiltro && mesFiltro !== "todos" && d.mesAno !== mesFiltro) return;

        pontos++;
      });

      ranking.push({ nome: data.nome, pontos });
    });

    ranking.sort((a, b) => b.pontos - a.pontos);

        document.getElementById("rankingContainer").innerHTML =
          ranking.slice(0, 5).map((r, i) =>

            `<div style="
              padding:10px;
              margin:8px 0;
              border:1px solid #ddd;
              border-radius:8px;
              background:#fff;
            ">

              <strong>
                ${
                  i === 0
                    ? "🥇"
                    : i === 1
                    ? "🥈"
                    : i === 2
                    ? "🥉"
                    : `${i + 1}º`
                }
              </strong>

              ${r.nome}

              <span style="
                float:right;
                font-weight:bold;
              ">
                ${r.pontos}
              </span>

              <br>

              <small style="color:#666">
                ${
                  r.pontos === 1
                    ? "1 checklist enviado"
                    : `${r.pontos} checklists enviados`
                }
              </small>

            </div>`

          ).join("");
  }
}


function gerarGrafico(id, labels, dados, coresCustom = null) {

  const canvas = document.getElementById(id);

  if (!canvas) return;

if (dados.every(v => v === 0)) {
  // não cria gráfico fake
  return;
}

  if (!window.graficos) window.graficos = {};

  if (window.graficos[id]) {
    window.graficos[id].destroy();
    delete window.graficos[id];
  }

  const ctx = canvas.getContext("2d");

  const coresMap = {
    OK: "#15c23e",
    Problemas: "#ffd814",
    Pendentes: "#187ed1 ",
    Aprovadas: "#03b32c",
    Reprovadas: "#d5061a"
  };

  window.graficos[id] = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: dados,
        backgroundColor:
          coresCustom || labels.map(l => coresMap[l] || "#999"),
        borderColor: "#fff",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 10
      }
    }
  });

  setTimeout(() => {
    window.graficos[id]?.resize();
  }, 50);
}


window.trocarGrafico = function (tipo) {

  const graficos = {
    tecnicos: "graficoTecnicos",
    problemas: "graficoFerramentasProblema",
    compras: "graficoCompras",
    ranking: "rankingContainer"
  };

  // ✅ esconde tudo
  document.querySelectorAll("#estatisticasView canvas")
    .forEach(c => c.style.display = "none");

  document.getElementById("rankingContainer").style.display = "none";

  // ✅ mostra apenas o correto
  const id = graficos[tipo];

  if (id) {
    document.getElementById(id).style.display = "block";
  }

  // ✅ atualiza dados ao trocar
  carregarEstatisticas();
};

window.baixarGrafico = () => {
  const canvas = document.querySelector("#estatisticasView canvas:not([style*='none'])");
  if (!canvas) return alert("Nenhum gráfico visível");
  const link = document.createElement("a");
  link.download = "grafico.png";
  link.href = canvas.toDataURL();
  link.click();
};

window.filtros = {
  tecnicos: null,
  problemas: null,
  compras: null,
  ranking: null
};

window.filtrarMes = () => {
  const mesSelecionado = document.getElementById("filtroMes").value;
  const tipoAtual = document.querySelector("#estatisticasView select:nth-of-type(1)").value;

  window.filtros[tipoAtual] = mesSelecionado;

  carregarEstatisticas();
};

window.abrirDocumentacao = async () => {

  esconderTudo();

  const view =
    document.getElementById(
      "documentacaoView"
    );

  if (view) {
    view.classList.remove("hidden");
  }

  if (
    window.dadosUsuarioAtual?.perfil ===
    "admin"
  ) {

    const form =
      document.getElementById(
        "formDocumento"
      );

    if (form) {
      form.style.display = "block";
    }

    await carregarTecnicosDocumentacao();

  } else {

    const form =
      document.getElementById(
        "formDocumento"
      );

    if (form) {
      form.style.display = "none";
    }
  }

  carregarDocumentos();
};

window.adicionarDocumento = async () => {

  try {

    const titulo =
      document.getElementById("docTitulo").value;

    const descricao =
      document.getElementById("docDescricao").value;

    const tecnicoUid =
      document.getElementById("docTecnico").value;

    const arquivo =
      document.getElementById("docArquivo").files[0];

    if (!titulo || !arquivo || !tecnicoUid) {

      alert(
        "Selecione um técnico e escolha um arquivo."
      );

      return;
    }

    const arquivoUrl =
      URL.createObjectURL(arquivo);

      
  const requerAssinatura =
  document.getElementById("docAssinatura")?.checked || false;

    await addDoc(
  collection(db, "documentos"),
  {
    titulo,
    descricao,
    tecnicoUid,
    gestorUid: window.usuarioLogadoUID,

    arquivoUrl,
    nomeArquivo: arquivo.name,

    // NOVOS CAMPOS
    requerAssinatura,
    status: requerAssinatura
      ? "pendente_assinatura"
      : "publicado",

    assinado: false,
    assinadoEm: null,
    assinadoPor: null,

    criadoEm: new Date()
  }
);

    alert("✅ Documento adicionado!");

    carregarDocumentos();

  } catch (err) {

    console.error(err);

    alert(
      "Erro ao adicionar documento:\n" +
      err.message
    );
  }
};

async function carregarDocumentos() {

  const container =
    document.getElementById("listaDocumentos");

  if (!container) return;

  container.innerHTML = "";

  const docsSnap =
    await getDocs(
      collection(db, "documentos")
    );

  const grupos = {};

  docsSnap.forEach((docSnap) => {

    const data = docSnap.data();

    // Técnico só vê os próprios
    if (
      window.dadosUsuarioAtual?.perfil ===
      "tecnico"
    ) {

      if (
        data.tecnicoUid !==
        window.usuarioLogadoUID
      ) {
        return;
      }
    }

    // Admin só vê documentos de técnicos dele
    if (
      window.dadosUsuarioAtual?.perfil ===
      "admin"
    ) {

      if (
        data.gestorUid !==
        window.usuarioLogadoUID
      ) {
        return;
      }
    }

    if (!grupos[data.tecnicoUid]) {
      grupos[data.tecnicoUid] = [];
    }

    grupos[data.tecnicoUid].push({
      id: docSnap.id,
      ...data
    });

  });

  for (const tecnicoUid in grupos) {

    const tecnicoSnap =
      await getDoc(
        doc(db, "users", tecnicoUid)
      );

    const nomeTecnico =
      tecnicoSnap.exists()
        ? tecnicoSnap.data().nome
        : "Técnico";

    const pasta =
      document.createElement("details");

    pasta.className = "pasta-tecnico";
      const qtd = grupos[tecnicoUid].length;

      pasta.innerHTML = `
        <summary>
          ${nomeTecnico}
          <span style="color:#666;font-weight:normal">
            ${qtd} ${qtd === 1 ? "arquivo" : "arquivos"}
          </span>
        </summary>
      `;
    grupos[tecnicoUid].forEach((docData) => {

      const card =
        document.createElement("div");

      card.className =
        "documento-card";
        let statusHtml = "";

        if (docData.requerAssinatura) {

          statusHtml =
            docData.assinado
              ? `
                <p style="color:green">
                  ✅ Assinado
                </p>
              `
              : `
                <p style="color:orange">
                  ⚠️ Assinatura pendente
                </p>
              `;
        }

      card.innerHTML = `

        <h3>${docData.titulo}</h3>

        ${statusHtml}

        <p>
          ${docData.descricao || ""}
        </p>

        <button
          onclick="abrirDocumento('${docData.arquivoUrl}')">
          Documento Original
        </button>

        ${
          window.dadosUsuarioAtual?.perfil === "tecnico" &&
          docData.requerAssinatura &&
          !docData.assinado
            ? `
              <button
                onclick="abrirUploadAssinado('${docData.id}')">
                Enviar Assinado
              </button>
            `
            : ""
        }

        ${
          docData.assinado &&
          docData.arquivoAssinadoUrl
            ? `
              <button
                onclick="abrirDocumento('${docData.arquivoAssinadoUrl}')">
                Documento Assinado
              </button>
            `
            : ""
        }

        ${
          docData.assinado
            ? `
              <p>
                Assinado por:
                ${docData.assinadoPor || "-"}
              </p>

            <p>
              Data:
              ${
                docData.assinadoEm
                  ? (
                      docData.assinadoEm.toDate
                        ? docData.assinadoEm
                            .toDate()
                            .toLocaleDateString("pt-BR")
                        : new Date(
                            docData.assinadoEm
                          ).toLocaleDateString("pt-BR")
                          
                    )
                  : "-"
              }
            </p>
            `
            
            : ""
        }

        ${
          window.dadosUsuarioAtual?.perfil === "admin"
            ? `
              <button
                onclick="excluirDocumento('${docData.id}')">
                Excluir
              </button>
            `
            : ""
        }

      `;

      pasta.appendChild(card);

    });

    container.appendChild(pasta);

  }
}

async function carregarTecnicosDocumentacao() {

  const select =
    document.getElementById("docTecnico");

  if (!select) return;

  
  select.innerHTML =
    '<option value="">Selecione um técnico</option>';

  const users =
    await getDocs(collection(db, "users"));

  users.forEach((u) => {

    const data = u.data();

    if (data.perfil === "tecnico") {

      const option =
        document.createElement("option");

      option.value = u.id;

      option.textContent =
        `${data.nome}`;

      select.appendChild(option);
    }
  });
}

window.abrirUploadAssinado = function (id) {

  const input = document.createElement("input");

  input.type = "file";

  input.accept = ".pdf,.doc,.docx,image/*";

  input.onchange = async () => {

    const arquivo = input.files[0];

    if (!arquivo) return;

    await enviarDocumentoAssinado(
      id,
      arquivo
    );
  };

  input.click();
};

window.enviarDocumentoAssinado = async function (
  id,
  arquivo
) {

  try {

    const arquivoAssinadoUrl =
      URL.createObjectURL(arquivo);

    await setDoc(
      doc(db, "documentos", id),
      {
        assinado: true,

        status: "assinado",

        arquivoAssinadoUrl,

        nomeArquivoAssinado:
          arquivo.name,

        assinadoPor:
          window.dadosUsuarioAtual.nome,

        assinadoEm:
          new Date()
      },
      {
        merge: true
      }
    );

    alert(
      "✅ Documento assinado enviado!"
    );

    carregarDocumentos();

  } catch (err) {

    console.error(err);

    alert(
      "Erro ao enviar documento assinado."
    );
  }
};

window.excluirDocumento = async (id) => {

  if (!confirm("Excluir documento?")) {
    return;
  }

  try {

    await deleteDoc(
      doc(db, "documentos", id)
    );

    alert("✅ Documento excluído");

    carregarDocumentos();

  } catch (err) {

    console.error(err);

    alert(
      "Erro ao excluir documento."
    );
  }
};

window.abrirDocumento = (url) => {

  if (!url) {

    alert("Documento não encontrado.");

    return;
  }

  window.open(url, "_blank");
};

function pegarGrupoFerramenta(nomeFerramenta) {

  for (const grupo in ferramentas) {
    if (ferramentas[grupo].includes(nomeFerramenta)) {
      return grupo;
    }
  }

  return "Outros";
}

window.abrirMinhasSolicitacoes =
  async () => {

    esconderTudo();

    const view =
      document.getElementById(
        "minhasSolicitacoesView"
      );

    if (!view) return;

    view.classList.remove(
      "hidden"
    );

    const container =
      document.getElementById(
        "listaMinhasSolicitacoes"
      );

    if (!container) return;

    container.innerHTML = "";

    const compras =
      await getDocs(
        collection(db, "compras")
      );

    const listaCompras = [];

    compras.forEach(docSnap => {

      const data = docSnap.data();

      if (
        data.tecnicoUid ===
        window.usuarioLogadoUID
      ) {

        listaCompras.push({
          id: docSnap.id,
          ...data
        });

      }

    });

    listaCompras.sort((a, b) => {

      const dataA =
        a.criadoEm?.toDate
          ? a.criadoEm.toDate()
          : new Date(a.criadoEm);

      const dataB =
        b.criadoEm?.toDate
          ? b.criadoEm.toDate()
          : new Date(b.criadoEm);

      return dataB - dataA;

    });

    listaCompras.forEach(data => {

      const card =
        document.createElement("div");

      card.className =
        "compra-card";

      card.innerHTML = `

  <h3>
    ${data.ferramenta}
  </h3>

  <p>
    <strong>Motivo:</strong>
    ${data.motivo || "-"}
  </p>

  <p>
    <strong>Solicitado em:</strong>
    ${
      data.criadoEm
        ? (
            data.criadoEm.toDate
              ? data.criadoEm
                  .toDate()
                  .toLocaleDateString("pt-BR")
              : new Date(
                  data.criadoEm
                ).toLocaleDateString("pt-BR")
          )
        : "-"
    }
  </p>

  <p>
    <strong>Status:</strong>
    ${
      {
        pendente: "Pendente",
        em_espera: "Em espera",
        aprovado: "Aprovado",
        reprovado: "Reprovado"
      }[data.status] || data.status
    }
  </p>

  ${
    data.status === "em_espera" &&
    data.comentarioGestor
      ? `
      <p>
        <strong>Comentário:</strong><br>
        ${data.comentarioGestor}
      </p>
      `
      : ""
  }

  ${
    data.status === "aprovado"
      ? `
      <p>
        <strong>Prazo:</strong>
        ${
          data.prazo
            ? new Date(data.prazo)
                .toLocaleDateString("pt-BR")
            : "-"
        }
      </p>

      <p>
        <strong>Local:</strong><br>
        ${data.localRetirada || "-"}
      </p>
      `
      : ""
  }

`;

      container.appendChild(card);

    });

  };
  
  window.abrirEstoque = () => {

  esconderTudo();

  const view =
    document.getElementById(
      "estoqueView"
    );

  if (!view) return;

  view.classList.remove("hidden");

  view.innerHTML = `
<h2>
  Estoque de Ferramentas
</h2>

<label>
  Unidade:
</label>

<select
  id="estoqueUnidade"onchange="carregarEstoque()">

  <option>
    São José dos Pinhais
  </option>

  <option>
    Passo Fundo
  </option>

  <option>
    Palmas
  </option>

  <option>
    Cuiabá
  </option>

</select>

<br><br>

<button class="btn-importar" onclick="importarEstoque()">
  Importar Planilha
</button>
<button class="btn-visualizar" onclick="visualizarEstoque()">
  Visualizar Estoque
</button>
<div id="listaEstoque">
</div>
`;
};
window.carregarEstoque = async () => {

  const unidade =
    document.getElementById(
      "estoqueUnidade"
    ).value;

  const snap =
    await getDoc(
      doc(
        db,
        "estoque",
        unidade
      )
    );

  if (!snap.exists()) {

    console.log(
      "Estoque não encontrado."
    );

    return;
  }

  const estoque =
    snap.data();

  console.log(
    estoque
  );
let html = "";
Object.entries(estoque).forEach(
  ([categoria, ferramentas]) => {

    html += `
      <details>

        <summary>
          ${categoria}
        </summary>
    `;
      Object.entries(
      ferramentas
    ).forEach(
      ([ferramenta, quantidade]) => {

        html += `
          <div
            style="
              margin-bottom:15px;
              padding:8px;
              border-bottom:1px solid #ddd;
            "
          >

            <strong>
              ${ferramenta}
            </strong>

            <br><br>

            Quantidade em estoque:

            <strong>
              ${quantidade}
            </strong>

          </div>
        `;

      }
    );
        html += `
      </details>
    `;
  }
);
return html;
};

window.importarEstoque = () => {


  const unidadeSelecionada =
  document.getElementById(
    "estoqueUnidade"
  ).value;

const unidadeGestor =
  window.dadosUsuarioAtual?.unidade;

if (
  unidadeSelecionada !== unidadeGestor
) {

  alert(
    `Você só pode importar estoque da unidade ${unidadeGestor}.`
  );

  return;
}
  const input =
    document.createElement("input");

  input.type = "file";

  input.accept = ".xlsx,.xls";

  input.onchange = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onload = (evento) => {

      const data =
        new Uint8Array(
          evento.target.result
        );

      const workbook =
        XLSX.read(data, {
          type: "array"
        });

      const primeiraAba =
        workbook.SheetNames[0];

      const sheet =
        workbook.Sheets[primeiraAba];

      const json =
        XLSX.utils.sheet_to_json(sheet);
        window.estoqueImportado = json;

      console.log(json);
      let html = "";

const colunas =
  Object.keys(json[0]);

for (
  let i = 0;
  i < colunas.length;
  i += 2
) {

  const categoria =
    colunas[i];

  const quantidadeColuna =
    colunas[i + 1];

  html += `
    <h3>${categoria}</h3>

    <table border="1">

      <tr>
        <th>Ferramenta</th>
        <th>Quantidade</th>
      </tr>
  `;

  json.forEach(item => {

    if (item[categoria]) {

      html += `
        <tr>

          <td>
            ${item[categoria]}
          </td>

          <td>
            ${
              item[
                quantidadeColuna
              ] ?? 0
            }
          </td>

        </tr>
      `;
    }

  });

  html += `
    </table><br>
  `;

}

const modal =
  document.createElement("div");

modal.id =
  "modalImportacaoEstoque";

modal.className =
  "modal";

  modal.innerHTML = `

  <div
    class="modal-content"
    style="
      position:relative;
      max-height:80vh;
      overflow-y:auto;
      width:900px;
      max-width:90%;
    "
  >

    <span
      onclick="document.getElementById('modalImportacaoEstoque')?.remove()"
      style="
        position:absolute;
        top:10px;
        right:15px;
        cursor:pointer;
        color:#952020;
        font-size:18px;
        font-weight:bold;
      "
    >
      ✖
    </span>

    <h2>
      📄 Pré-visualização do Estoque
    </h2>

    ${html}

    <br>

    <button class="btn-confirmarImportacao"onclick="confirmarImportacao()"
    >
       Confirmar Importação
    </button>

  </div>

`;
document.body.appendChild(modal);
    };

    reader.readAsArrayBuffer(file);

  };

  input.click();

  document
  .getElementById(
    "modalImportacaoEstoque"
  )
  ?.remove();


};
window.confirmarImportacao = () => {

  const estoque = {};

  const json =
    window.estoqueImportado;

  const colunas =
    Object.keys(json[0]);

  for (
    let i = 0;
    i < colunas.length;
    i += 2
  ) {

    const categoria =
      colunas[i];

    const colunaQuantidade =
      colunas[i + 1];

    estoque[categoria] = {};

    json.forEach(item => {

      const ferramenta =
        item[categoria];

      const quantidade =
        item[colunaQuantidade];

      if (ferramenta) {

        estoque[categoria][ferramenta] =
          quantidade || 0;

      }

    });

  }

  console.log(estoque);
  const unidade =
  document.getElementById(
    "estoqueUnidade"
  ).value;

  console.log(
  "Unidade:",
  unidade
);

estoque.ultimaAtualizacao =
  new Date();

setDoc(
  doc(
    db,
    "estoque",
    unidade
  ),
  estoque
);
alert(
  "✅ Estoque salvo com sucesso!"
);
document
  .getElementById(
    "modalImportacaoEstoque"
  )
  ?.remove();
};

window.visualizarEstoque = async () => {

  const unidade =
    document.getElementById(
      "estoqueUnidade"
    ).value;

  const snap =
    await getDoc(
      doc(
        db,
        "estoque",
        unidade
      )
    );

if (!snap.exists()) {

  alert(
    "📦 Esta unidade ainda não possui estoque cadastrado.\n\nImporte uma planilha para iniciar o controle de estoque."
  );

  return;
}

  const estoque =
    snap.data();
  const ultimaAtualizacao =
  estoque.ultimaAtualizacao;
  let html = "";

Object.entries(estoque)
  .filter(
    ([categoria]) =>
      categoria !==
      "ultimaAtualizacao"
  )
  .sort((a, b) =>
    a[0].localeCompare(
      b[0],
      "pt-BR"
    )
  )
  .forEach(
    ([categoria, ferramentas]) => {

      html += `

        <details>

          <summary>
            ${categoria}
          </summary>

      `;

      Object.entries(
        ferramentas
      ).forEach(
        ([ferramenta, quantidade]) => {

          html += `

            <div
              style="
                margin-bottom:15px;
                padding:8px;
                border-bottom:1px solid #ddd;
              "
            >

              <strong>
                ${ferramenta}
              </strong>

              <br><br>

              Quantidade em estoque:

              <strong>
                ${quantidade}
              </strong>

            </div>

          `;

        }
      );

      html += `
        </details>
      `;

    }
  );

  const modal =
    document.createElement("div");

  modal.id =
    "modalVisualizarEstoque";

  modal.className =
    "modal";

  modal.innerHTML = `

    <div
      class="modal-content"
      style="
        position:relative;
        max-height:80vh;
        overflow-y:auto;
        width:700px;
        max-width:90%;
      "
    >

      <span
        onclick="document.getElementById('modalVisualizarEstoque')?.remove()"
        style="
          position:absolute;
          top:10px;
          right:15px;
          cursor:pointer;
          color:#952020;
          font-size:18px;
          font-weight:bold;
        "
      >
        ✖
      </span>

      <h2>
        📦 Estoque - ${unidade}
      </h2>
      <p
  style="
    color:#666;
    font-size:14px;
  "
>

  🕒 Última atualização:

  ${
    ultimaAtualizacao
      ? ultimaAtualizacao
          .toDate()
          .toLocaleString("pt-BR")
      : "Não informado"
  }

</p>
      ${html}

    </div>

  `;

  document.body.appendChild(
    modal
  );

};

const btnMenu =
  document.getElementById("btnMenu");

const sidebar =
  document.getElementById("sidebar");

const app =
  document.getElementById("app");

btnMenu.addEventListener(
  "click",
  () => {

    sidebar.classList.toggle(
      "open"
    );

    app.classList.toggle(
      "sidebar-open"
    );

  }
);


function montarSidebar(perfil) {

  const menu =
    document.getElementById(
      "sidebarMenu"
    );

  if (!menu) return;

  menu.innerHTML = ""; 
    if (perfil === "tecnico") {

  menu.innerHTML = `

    <li>
      <div
        class="menu-item"
        onclick="abrirChecklist()"
      >
        Checklist
      </div>
    </li>

    <li>
      <div
        class="menu-item"
        onclick="abrirRegras()"
      >
        Regras
      </div>
    </li>

    <li>
      <div
        class="menu-item"
        onclick="abrirDocumentacao()"
      >
        Documentação
      </div>
      <li>

  <div
    id="menuCompras"
    class="menu-principal"
  >
    Compras
  </div>

  <ul
    id="submenuCompras"
    class="submenu hidden"
  >

    <li onclick="abrirCompras()">
      Solicitar Compra
    </li>

    <li onclick="abrirMinhasSolicitacoes()">
      Minhas Solicitações
    </li>

  </ul>
    </li>

  `;
}
if (perfil === "admin") {

  menu.innerHTML = `

    <li>
      <div
        class="menu-item"
        onclick="abrirAdmin()"
      >
        Análise de Técnicos
      </div>
    </li>

    <li>
      <div
        class="menu-item"
        onclick="abrirRegras()"
      >
        Regras
      </div>
    </li>

    <li>
      <div
        class="menu-item"
        onclick="abrirMaletas()"
      >
        Maletas
      </div>
    </li>

    <li>
  <div
    class="menu-item"
    onclick="abrirEstatisticas()"
  >
    Estatísticas
  </div>
</li>

<li>
  <div
    class="menu-item"
    onclick="abrirDocumentacao()"
  >
    Documentação
  </div>
</li>
<li>

  <div
    id="menuCompras"
    class="menu-principal"
  >
    Compras
  </div>

  <ul
    id="submenuCompras"
    class="submenu hidden"
  >

    <li onclick="abrirAprovarCompras()">
      Solicitações de Compras
    </li>

    <li>
      Notas Fiscais
    </li>

    <li>
      Ferramentas por Técnico
    </li>

    <li>
      Desligamento
    </li>

    <li> 
      Relatório Patrimonial
    </li>

  </ul>

</li>
<li>
  <div
    class="menu-item"
    onclick="abrirEstoque()"
  >
    Estoque
  </div>
</li>
  `;
const menuCompras =
  document.getElementById(
    "menuCompras"
  );

const submenuCompras =
  document.getElementById(
    "submenuCompras"
  );

if (
  menuCompras &&
  submenuCompras
) {

  menuCompras.addEventListener(
    "click",
    () => {

      submenuCompras.classList.toggle(
        "hidden"
      );

    }
  );

}
}
}
