export class Documento {
    $key: string;
    arquivo: File;
    descricao: string;
    url: string;
    progresso: number;
    criadoEm: string;

    categoria: string;
    clienteEmail: string;
    clienteNome: string;
    funcionarioEmail: string;
    funcionarioNome: string;
    categoria_clienteEmail: string;

    constructor(file: File) {
        this.arquivo = file;

        // Atribui a data atual ao documento
        var today = new Date();
        var dd: any = today.getDate();
        var mm: any = today.getMonth() + 1; //January is 0!
        var yyyy: any = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        this.criadoEm = dd + '/' + mm + '/' + yyyy;
    }
}